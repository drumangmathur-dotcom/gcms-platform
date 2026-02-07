import { NextRequest, NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { createSplitPaymentIntent } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase-server';

interface CreateOrderRequest {
    programId: string;
    amount: number;
}

/**
 * POST /api/payments/create-order
 * Server-side payment order creation
 * Determines gateway (Razorpay vs Stripe) based on program location
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = clerkAuth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: CreateOrderRequest = await request.json();
        const { programId, amount } = body;

        // Fetch program details from database
        const { data: program, error: programError } = await supabaseServer
            .from('programs')
            .select('*, hospitals(location_city, bank_account_id)')
            .eq('id', programId)
            .single();

        if (programError || !program) {
            return NextResponse.json(
                { error: 'Program not found' },
                { status: 404 }
            );
        }

        // Type assertion for joined data
        const programData = program as any;

        // Determine payment gateway based on location
        const locationCity = programData.hospitals?.location_city || '';
        const isIndia = locationCity.toLowerCase().includes('india') ||
            locationCity.toLowerCase().includes('delhi') ||
            locationCity.toLowerCase().includes('mumbai');

        if (isIndia) {
            // Use Razorpay for India
            const result = await createRazorpayOrder({
                amountUsd: amount,
                programTitle: programData.title,
                receiptId: `${userId}_${programId}_${Date.now()}`,
            });

            if (!result.success) {
                return NextResponse.json(
                    { error: 'Failed to create Razorpay order' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                gateway: 'razorpay',
                orderId: result.orderId,
                amountInr: result.amountInr,
                keyId: result.keyId,
            });
        } else {
            // Use Stripe for US/UK
            const hospitalAccountId = programData.hospitals?.bank_account_id;

            if (!hospitalAccountId) {
                return NextResponse.json(
                    { error: 'Hospital Stripe account not configured' },
                    { status: 400 }
                );
            }

            const result = await createSplitPaymentIntent({
                amountUsd: amount,
                destinationAccountId: hospitalAccountId,
                commissionPercentage: 20, // Platform keeps 20%, hospital gets 80%
            });

            return NextResponse.json({
                gateway: 'stripe',
                clientSecret: result.clientSecret,
                paymentIntentId: result.id,
            });
        }
    } catch (error) {
        console.error('Payment order creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
