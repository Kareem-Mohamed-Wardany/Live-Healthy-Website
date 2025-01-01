import React, { useEffect, useState } from 'react';
import PaymentForm from '../../../components/PaymentForm';
import Nav from '../../../components/Nav';// The component with the payment form
import VIP from '../../../assets/images/vip1.png'
import bronze from '../../../assets/images/bronze-medal.png'
import silver from '../../../assets/images/silver-medal.png'
import gold from '../../../assets/images/gold-medal.png'
import { useAppContext } from '../../../provider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export function PurchaseVIP(props) {
    const navigate = useNavigate();
    const { createNotification } = useAppContext();
    const [isSuccessful, setIsSuccessful] = useState(false)
    const [price, setPrice] = useState(0)
    const [name, setName] = useState('')
    const user = props.user
    const menuItems = [
        { levelIcon: bronze, price: 100, discount: 15, name: "Bronze" },
        { levelIcon: silver, price: 190, discount: 50, name: "Silver" },
        { levelIcon: gold, price: 350, discount: 100, name: "Gold" },
    ];

    useEffect(() => {
        const handle = async () => {
            if (user.balance < price) {
                createNotification("Insufficient Coins", "error");
                setIsSuccessful(false)
                return;
            }
            if (user.vip.level === "Gold") {
                switch (name) {
                    case "Bronze":
                        createNotification("You cannot purchase a lower level VIP", "error");
                        setIsSuccessful(false)
                        return;
                    case 'Silver':
                        createNotification("You cannot purchase a lower level VIP", "error");
                        setIsSuccessful(false)
                        return;
                    default:
                        break;
                }
            }
            else if (user.vip.level === "Silver") {
                switch (name) {
                    case 'Bronze':
                        createNotification("You cannot purchase a lower level VIP", "error");
                        setIsSuccessful(false)
                        return;
                    default:
                        break;
                }
            }
            let endDate = new Date();
            if (user.vip.expireDate !== null) {
                endDate = new Date(user.vip.expireDate)
            }
            endDate.setDate(endDate.getDate() + 30)
            const balance = user.balance - price;
            const res = await axios.post(
                'http://localhost:8080/user/update-vip',
                {
                    id: user._id, // User ID
                    balance: balance, // New balance
                    vip: {
                        level: name,
                        expireDate: endDate.toISOString()
                    },
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Authorization header
                    }
                }
            );

            console.log(res)
            if (res.status === 401) {
                createNotification("Not Authenticated", "error");
                setIsSuccessful(false)
                return;
            }
            if (res.status === 404) {
                createNotification("User Not Found", "error");
                setIsSuccessful(false)
                return;
            }
            if (res.status === 500) {
                createNotification("Server Error, Try again later", "error");
                setIsSuccessful(false)
                return;
            }
            if (res.status === 200) {
                createNotification(`${name} bought successfully!`, "success");
                setIsSuccessful(false)
                setTimeout(() => {
                    navigate(0); // Call navigate(0) after 30 seconds
                }, 3000);
            }
        }
        if (isSuccessful) {
            handle()
        }
    }, [isSuccessful])

    return (
        <>
            <Nav user={user} />
            <div className='w-w-full sm:w-[80%] mt-6 mx-auto'>
                <img
                    src={VIP}
                    alt="VIP"
                    className='w-full h-[70px] sm:h-[200px] object-contain mb-4 sm:mb-8'
                />
                <div className='flex flex-wrap justify-center gap-4 sm:gap-6'>
                    {menuItems.map((item) => {
                        return (
                            <div
                                key={item.levelIcon}
                                className='flex flex-col items-center justify-center gap-2 sm:gap-4 w-full sm:w-56 h-fit p-4 bg-gray-50 border border-gray-300 rounded-xl shadow-xl m-2'
                            >
                                <h1 className='text-lg sm:text-xl text-NavColor font-bold'>
                                    {item.name} Plan
                                </h1>
                                <img
                                    src={item.levelIcon}
                                    alt='cash level'
                                    className='w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] object-contain mb-4'
                                />
                                <p className='text-xl sm:text-2xl font-bold text-gray-700'>
                                    {item.price} Coins
                                </p>
                                <p className='text-xl sm:text-2xl text-primary'>
                                    Discount{' '}
                                    <span className='text-2xl sm:text-3xl text-NavColor font-bold'>
                                        {item.discount}%
                                    </span>
                                </p>
                                <button
                                    onClick={() => {
                                        setIsSuccessful(true);
                                        setPrice(item.price);
                                        setName(item.name);
                                    }}
                                    className='mt-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-400 hover:to-teal-400 text-white font-medium rounded-lg py-3 px-6 transition duration-300'
                                >
                                    Purchase
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

        </>
    );
}
