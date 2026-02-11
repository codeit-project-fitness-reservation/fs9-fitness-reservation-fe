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
        const clientKey =
          process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY ||
          'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
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
        await widgets.setAmount({
          currency: 'KRW',
          value: amount,
        });

        const [paymentMethodWidget] = await Promise.all([
          widgets.renderPaymentMethods({
            selector: `#${widgetId}`,
            variantKey: 'DEFAULT',
          }),
          widgets.renderAgreement({
            selector: `#${agreementId}`,
            variantKey: 'AGREEMENT',
          }),
        ]);

        paymentMethodWidget.on('paymentMethodSelect', (selectedPaymentMethod: unknown) => {
          onPaymentMethodSelect?.(selectedPaymentMethod);
        });

        paymentMethodWidgetRef.current = paymentMethodWidget;
        setReady(true);
        onReady?.(widgets, paymentMethodWidget);
      } catch (error) {
        console.error('Payment widget rendering error:', error);
      }
    }

    renderPaymentWidgets();
  }, [widgets, amount, widgetId, agreementId, onReady, onPaymentMethodSelect]);

  useEffect(() => {
    if (widgets && ready) {
      widgets.setAmount({
        currency: 'KRW',
        value: amount,
      });
    }
  }, [amount, widgets, ready]);

  return (
    <div className="flex flex-col gap-4">
      <div id={widgetId} className="w-full" />
      <div id={agreementId} className="w-full" />
    </div>
  );
}
