"use client";

import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function CheckoutButton({
    programId,
    price,
    children
}: {
    programId: string;
    price: number;
    children?: React.ReactNode;
}) {
    const { user, isLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        if (!isLoaded || !user?.id) {
            alert("Please sign in to continue");
            return;
        }

        setIsLoading(true);

        try {
            // Call server-side API to create order
            const response = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    programId,
                    amount: price,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment order');
            }

            const orderData = await response.json();

            if (orderData.gateway === 'razorpay') {
                // Initialize Razorpay checkout
                const options = {
                    key: orderData.keyId,
                    amount: orderData.amountInr * 100, // Convert to paise
                    currency: "INR",
                    name: "GCMS Platform",
                    description: `Payment for Program ${programId}`,
                    order_id: orderData.orderId,
                    handler: async (response: any) => {
                        console.log("Razorpay payment response:", response);
                        alert("Payment Successful! Redirecting to dashboard...");
                        window.location.href = '/dashboard/student';
                    },
                    prefill: {
                        name: user.fullName || '',
                        email: user.emailAddresses[0]?.emailAddress || '',
                    },
                    theme: {
                        color: "#d97706", // Amber-600
                    },
                };
                // @ts-ignore
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else if (orderData.gateway === 'stripe') {
                // Redirect to Stripe Checkout or use Stripe Elements
                alert("Stripe checkout initiated. (Full integration requires Stripe.js Elements)");
                // For a complete implementation, you would load Stripe.js and use Elements here
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred during checkout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            <Button
                onClick={handleCheckout}
                disabled={isLoading || !isLoaded}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    children || `Pay $${price.toFixed(2)}`
                )}
            </Button>
        </div>
    );
}
