import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAppContext } from '../../provider';

const PaymentForm = (props) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const stripe = useStripe();
    const amount = props.value || 1000;
    const elements = useElements();
    const { createNotification } = useAppContext()

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return; // Stripe.js has not loaded yet
        }

        setIsProcessing(true);

        try {
            // 1. Create a Payment Intent on the backend
            const res = await axios.post('http://localhost:8080/purchase', {
                amount, // Send the amount to the backend
            });
            if (res.status > 201) {
                createNotification("Not Authenticated", "error");
            }
            else {

                const { clientSecret } = res.data;

                // 2. Confirm the Payment with the card details
                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                });

                if (error) {
                    createNotification(error.message, "error");
                    setError(error.message);
                } else {
                    if (paymentIntent.status === 'succeeded') {
                        props.setIsSuccessful(true)

                    }
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Complete Your Payment</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="card" className="block text-sm font-medium text-gray-600">
                        Card details
                    </label>
                    <div className="mt-2">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

                <button
                    type="submit"
                    disabled={isProcessing || !stripe || !elements}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
