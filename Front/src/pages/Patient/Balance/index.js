import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../../../components/PaymentForm';
import Nav from '../../../components/Nav';// The component with the payment form
import cash1 from '../../../assets/images/cashlvl1.png'
import cash2 from '../../../assets/images/cashlvl2.png'
import cash3 from '../../../assets/images/cashlvl3.png'
import { useAppContext } from '../../../provider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// Load your Stripe public key
const stripePromise = loadStripe('pk_test_51QazKN2KFmiojCn6rUEflN7WBPhqckHXRf5QlrjujYyxehwpOBRplkGr03zC5l2GlJTnkO7QaO2ZSyOS6FznNMbU00Xo4rlnhH'); // Use your actual publishable key

function Balance(props) {
    const navigate = useNavigate();
    const { createNotification } = useAppContext();
    const [amount, setAmount] = useState(0)
    const [isPaying, setIsPaying] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(false)
    const [price, setPrice] = useState(0)
    const user = props.user
    const menuItems = [
        { levelIcon: cash1, price: 7, balance: 100 },
        { levelIcon: cash2, price: 12, balance: 200 },
        { levelIcon: cash3, price: 20, balance: 400 },
    ];

    useEffect(() => {
        const handle = async () => {
            const balance = user.balance + amount;
            const res = await axios.post(
                'http://localhost:8080/user/update-balance',
                {
                    balance: balance // New balance
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Authorization header
                    }
                }
            );

            console.log(res)
            if (res.status === 200 || res.statusCode === 200) {
                createNotification(`Payment successful! Add ${amount} coins for $${price / 100}`, "success");
                setIsSuccessful(false)
                setTimeout(() => {
                    navigate(0); // Call navigate(0) after 30 seconds
                }, 3000);
            }
        }
        if (isSuccessful) {
            setIsPaying(false)
            handle()
        }
    }, [isSuccessful])

    return (
        <>
            <Nav user={user} />
            <div className="w-full sm:w-[80%] mt-6 mx-auto">
                <h1 className="block text-3xl font-bold text-gray-700 mb-5 text-center">
                    Purchase Credits
                </h1>
                <div className="flex flex-wrap justify-center gap-6">
                    {menuItems.map((item) => {
                        return (
                            <div
                                key={item.levelIcon}
                                className="flex flex-col items-center justify-center w-full sm:w-[45%] md:w-[30%] lg:w-[22%] p-4 bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
                            >
                                <img
                                    src={item.levelIcon}
                                    alt="cash level"
                                    className="w-[60px] h-[60px] object-contain mb-4"
                                />
                                <p className="text-xl font-bold text-gray-700">${item.price}</p>
                                <p className="text-sm text-gray-500">{item.balance} Coins</p>
                                <button
                                    onClick={() => {
                                        setIsPaying(true);
                                        setAmount(item.balance);
                                        setPrice(item.price * 100);
                                    }}
                                    className="mt-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-400 hover:to-teal-400 text-white font-medium rounded-lg py-3 px-6 transition duration-300"
                                >
                                    Purchase
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isPaying && (
                <div className="absolute inset-0 flex justify-center items-center p-4 bg-black bg-opacity-50 z-50">
                    <div className="rounded-lg w-full max-w-lg p-6">
                        <Elements stripe={stripePromise}>
                            <PaymentForm value={price} setIsSuccessful={setIsSuccessful} />
                        </Elements>
                    </div>
                </div>
            )}

        </>
    );
}

export default Balance;
