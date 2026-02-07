// @ts-nocheck - Supabase SDK type inference limitations with service role client
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseServer } from '@/lib/supabase-server';

const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

/**
 * Verify Razorpay webhook signature
 */
function verifyRazorpaySignature(body: string, signature: string): boolean {
    if (!razorpayWebhookSecret) {
        console.warn('RAZORPAY_WEBHOOK_SECRET not configured');
        return true; // Allow in development
    }

    const expectedSignature = crypto
        .createHmac('sha256', razorpayWebhookSecret)
        .update(body)
        .digest('hex');

    return expectedSignature === signature;
}

/**
 * POST /api/webhooks/razorpay
 * Handle Razorpay webhook events
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-razorpay-signature') || '';

        // Verify signature
        if (!verifyRazorpaySignature(body, signature)) {
            console.error('Razorpay webhook signature verification failed');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);

        // Handle the event
        switch (event.event) {
            case 'payment.captured': {
                const payment = event.payload.payment.entity;
                console.log('Razorpay payment captured:', payment.id);

                // Extract application ID from notes
                const applicationId = payment.notes?.application_id;

                if (applicationId) {
                    const { error } = await supabaseServer
                        .from('applications')
                        .update({
                            status: 'paid' as const,
                            updated_at: new Date().toISOString()
                        } as any)
                        .eq('id', applicationId);

                    if (error) {
                        console.error('Failed to update application status:', error);
                    } else {
                        console.log(`Application ${applicationId} marked as paid`);
                    }
                }

                break;
            }

            case 'payment.failed': {
                const payment = event.payload.payment.entity;
                console.log('Razorpay payment failed:', payment.id);
                break;
            }

            case 'order.paid': {
                const order = event.payload.order.entity;
                console.log('Razorpay order paid:', order.id);
                break;
            }

            default:
                console.log(`Unhandled Razorpay event: ${event.event}`);
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Razorpay webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
