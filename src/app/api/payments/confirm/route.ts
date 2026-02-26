import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ message: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: 'TOSS_PAYMENTS_SECRET_KEY is not configured' },
        { status: 500 },
      );
    }
    const encryptedSecretKey = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');

    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, paymentKey }),
      headers: {
        Authorization: encryptedSecretKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || '결제 승인에 실패했습니다.', code: data.code },
        { status: response.status },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json({ message: '결제 승인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
