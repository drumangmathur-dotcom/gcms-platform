// @ts-nocheck - Supabase SDK type inference limitations with service role client
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase-server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = headers().get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing stripe-signature header' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('Payment succeeded:', paymentIntent.id);

                // Update application status in database
                // Extract metadata (assuming we stored application_id in metadata)
                const applicationId = paymentIntent.metadata?.application_id;

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

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('Payment failed:', paymentIntent.id);
                break;
            }

            case 'account.updated': {
                // Handle Connect account updates if needed
                const account = event.data.object as Stripe.Account;
                console.log('Account updated:', account.id);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
