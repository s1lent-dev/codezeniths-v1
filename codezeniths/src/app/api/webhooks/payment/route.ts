import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '../../../../service/payment/payment.service';

export async function POST(req: NextRequest) {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
        return NextResponse.json(
            { error: 'Missing x-razorpay-signature header' },
            { status: 400 }
        );
    }

    try {
        const rawBody = await req.text();
        const success = await paymentService.handleIncomingWebhook(rawBody, signature);

        if (!success) {
            return NextResponse.json(
                { error: 'Invalid webhook signature' },
                { status: 400 }
            );
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'Internal server error processing webhook' },
            { status: 500 }
        );
    }
}
