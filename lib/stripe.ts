import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing. Please add it to your .env.local file.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Use latest API version
    typescript: true,
});

export interface CreateConnectAccountParams {
    email: string;
    hospitalName: string;
}

export interface SplitPaymentParams {
    amountUsd: number;
    destinationAccountId: string; // The Hospital's Connect ID (acct_...)
    commissionPercentage?: number; // Default 20%
}

/**
 * 1. ONBOARDING: Create a Stripe Connect Account for a Hospital
 * This allows the hospital to receive their share of the fees.
 */
export async function createHospitalAccount(params: CreateConnectAccountParams) {
    const account = await stripe.accounts.create({
        type: 'express',
        country: 'US', // Assuming US/UK entities for now, can be dynamic
        email: params.email,
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
        business_profile: {
            name: params.hospitalName,
        },
    });

    // Create an account link for the hospital to complete onboarding
    const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/admin?refresh=true`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/admin?success=true`,
        type: 'account_onboarding',
    });

    return {
        accountId: account.id,
        onboardingUrl: accountLink.url
    };
}

/**
 * 2. CHARGING: Create a Payment Intent with Split Logic
 * Student pays $2500 -> $2000 to Platform, $500 to Hospital.
 */
export async function createSplitPaymentIntent(params: SplitPaymentParams) {
    const { amountUsd, destinationAccountId, commissionPercentage = 20 } = params;

    // Stripe expects amounts in cents
    const totalAmountCents = Math.round(amountUsd * 100);

    // Calculate shares
    const platformFeePercent = 100 - commissionPercentage; // e.g. 80%
    const types = 'payment'; // Just to clarify usage context

    // In Stripe Connect "Destination Charges" (simpler for this use case):
    // Use application_fee_amount to specify what YOU keep.
    const applicationFeeCents = Math.round(totalAmountCents * (platformFeePercent / 100));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmountCents,
        currency: 'usd',
        payment_method_types: ['card'],
        application_fee_amount: applicationFeeCents,
        transfer_data: {
            destination: destinationAccountId,
        },
    });

    return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
    };
}
