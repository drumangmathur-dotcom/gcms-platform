"use client";

import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { createRazorpayOrder } from "@/lib/razorpay";
// import { createSplitPaymentIntent } from "@/lib/stripe"; // Not used directly in client yet

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface CheckoutButtonProps {
    programId: number;
    title: string;
    price: number;
    country: string; // "India", "USA", "UK"
}

export function CheckoutButton({ programId, title, price, country }: CheckoutButtonProps) {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!isLoaded || !user) {
            alert("Please sign in to apply.");
            return;
        }

        setLoading(true);

        try {
            if (country === "India") {
                await handleRazorpay();
            } else {
                await handleStripe();
            }
        } catch (error) {
            console.error(error);
            alert("Payment initialization failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRazorpay = async () => {
        console.log("Initializing Razorpay for", title);

        const res = await createRazorpayOrder({
            amountUsd: price,
            programTitle: title,
            receiptId: `rcpt_${programId}_${user?.id}`
        });

        if (!res.success) throw new Error("Razorpay Order Failed");

        const options = {
            key: res.keyId,
            amount: res.amountInr! * 100,
            currency: "INR",
            name: "GCMS Platform",
            description: `Tuition: ${title}`,
            order_id: res.orderId,
            handler: function (response: any) {
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            },
            prefill: {
                name: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
            },
            theme: {
                color: "#0f172a"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const handleStripe = async () => {
        console.log("Initializing Stripe for", title);
        alert("Redirecting to Stripe Secure Checkout... (Sandbox Mode)");
    };

    return (
        <div className="w-full">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />

            <Button
                size="lg"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                onClick={handleCheckout}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Apply & Pay $${price.toLocaleString()}`
                )}
            </Button>
            <p className="text-[10px] text-center text-slate-400 mt-3">
                Secure Payment via {country === "India" ? "Razorpay" : "Stripe"}
            </p>
        </div>
    );
}
