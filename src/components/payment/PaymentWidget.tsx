'use client';

import { useEffect, useRef, useState } from 'react';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';

interface PaymentWidgetProps {
  customerKey?: string;
  amount: number;
  onReady?: (widgets: unknown, paymentMethodWidget: unknown) => void;
  onPaymentMethodSelect?: (paymentMethod: unknown) => void;
}

export default function PaymentWidget({
  customerKey,
  amount,
  onReady,
  onPaymentMethodSelect,
}: PaymentWidgetProps) {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<unknown>(null);
  const paymentMethodWidgetRef = useRef<unknown>(null);
  const [widgetId] = useState(() => `payment-method-${Date.now()}`);
  const [agreementId] = useState(() => `agreement-${Date.now()}`);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error('NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY is not set');
        }
        const tossPayments = await loadTossPayments(clientKey);
        const widgetsInstance = tossPayments.widgets({
          customerKey: customerKey || ANONYMOUS,
        });
        setWidgets(widgetsInstance);
      } catch (error) {
        console.error('Payment widgets initialization error:', error);
      }
    }

    fetchPaymentWidgets();
  }, [customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      try {
        const widgetsInstance = widgets as {
          setAmount: (amount: { currency: string; value: number }) => Promise<void>;
          renderPaymentMethods: (options: { selector: string; variantKey: string }) => Promise<{
            on: (event: string, callback: (data: unknown) => void) => void;
            getSelectedPaymentMethod?: () => Promise<unknown>;
          }>;
          renderAgreement: (options: { selector: string; variantKey: string }) => Promise<void>;
        };

        await widgetsInstance.setAmount({
          currency: 'KRW',
          value: amount,
        });

        const variantKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_VARIANT_KEY ?? 'DEFAULT';

        const [paymentMethodWidget] = await Promise.all([
          widgetsInstance.renderPaymentMethods({
            selector: `#${widgetId}`,
            variantKey,
          }),
          widgetsInstance.renderAgreement({
            selector: `#${agreementId}`,
            variantKey: 'AGREEMENT',
          }),
        ]);

        // 결제 방법 선택 이벤트 리스너 등록
        paymentMethodWidget.on('paymentMethodSelect', (selectedPaymentMethod: unknown) => {
          console.log('Payment method selected in widget:', selectedPaymentMethod);
          onPaymentMethodSelect?.(selectedPaymentMethod);
        });

        // 위젯이 준비되면 현재 선택된 결제 방법 확인
        try {
          const widgetWithMethod = paymentMethodWidget as unknown as {
            getSelectedPaymentMethod?: () => Promise<unknown>;
          };
          if (widgetWithMethod.getSelectedPaymentMethod) {
            const currentMethod = await widgetWithMethod.getSelectedPaymentMethod();
            if (currentMethod) {
              console.log('Current payment method:', currentMethod);
              onPaymentMethodSelect?.(currentMethod);
            }
          }
        } catch (error) {
          console.log('No initial payment method selected');
        }

        paymentMethodWidgetRef.current = paymentMethodWidget;
        setReady(true);
        onReady?.(widgetsInstance, paymentMethodWidget);
      } catch (error) {
        console.error('Payment widget rendering error:', error);
      }
    }

    renderPaymentWidgets();
  }, [widgets, amount, widgetId, agreementId, onReady, onPaymentMethodSelect]);

  useEffect(() => {
    if (widgets && ready) {
      const widgetsInstance = widgets as {
        setAmount: (amount: { currency: string; value: number }) => Promise<void>;
      };
      widgetsInstance.setAmount({
        currency: 'KRW',
        value: amount,
      });
    }
  }, [amount, widgets, ready]);

  return (
    <div className="flex flex-col gap-4">
      <div id={widgetId} className="min-h-[120px] w-full" aria-label="토스페이먼츠 결제수단 선택" />
      <div id={agreementId} className="w-full" />
    </div>
  );
}
