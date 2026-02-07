import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("Razorpay keys missing from .env.local");
}

// Lazy initialization to prevent build errors if keys are missing
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        // Return null or throw custom error if critical, but for build safety just warn
        console.warn("Razorpay keys missing. Payment creation will fail.");
        return null;
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

export interface CreateRazorpayOrderParams {
    amountUsd: number; // We will convert approx to INR
    programTitle: string;
    receiptId: string;
}

/**
 * 1. CURRENCY CONVERSION:
 * Razorpay works best in INR for Indian entities.
 * We'll use a fixed mock rate or fetch live if needed.
 */
const USD_TO_INR_RATE = 83.5;

export async function createRazorpayOrder(params: CreateRazorpayOrderParams) {
    const amountInr = Math.round(params.amountUsd * USD_TO_INR_RATE);

    // Amount in Paile (1 INR = 100 Paise)
    const amountPaise = amountInr * 100;

    const options = {
        amount: amountPaise,
        currency: "INR",
        receipt: params.receiptId,
        payment_capture: 1, // Auto capture
        notes: {
            program: params.programTitle
        }
    };

    try {
        const razorpay = getRazorpayInstance();
        if (!razorpay) {
            throw new Error("Razorpay not initialized (missing keys)");
        }
        const order = await razorpay.orders.create(options);
        return {
            success: true,
            orderId: order.id,
            amountInr: amountInr,
            keyId: process.env.RAZORPAY_KEY_ID
        };
    } catch (error) {
        console.error("Razorpay Error:", error);
        return { success: false, error: error };
    }
}
