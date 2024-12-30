import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Male from '../../assets/images/Male.png'
import Female from '../../assets/images/Female.png'
import coin from '../../assets/images/coin.png'
import logo from "../../assets/images/Logo.png"

import '@fortawesome/fontawesome-free/css/all.min.css';

const Nav = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = props.user
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiryDate');
        navigate(0);
    }


    return (
        <>
            {user.accountType === "patient" &&
                <>
                    <nav className="w-full bg-NavColor flex justify-between items-center p-4">
                        {/* Logo and Title */}
                        <div className="flex items-center">
                            <img src={logo} alt="Live Healthy" className="w-12 h-12" />
                        </div>

                        {/* Navigation Links - Hidden on small screens, shown on larger screens */}
                        <ul className="hidden md:flex space-x-6 text-white">
                            <li>
                                <a
                                    href="/predict"
                                    className={`hover:text-blue-400 ${location.pathname === "/predict" ? "text-blue-500 font-bold" : ""}`}
                                >
                                    Predict
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/chat"
                                    className={`hover:text-blue-400 ${location.pathname === "/chat" ? "text-blue-500 font-bold" : ""}`}
                                >
                                    Chat
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/purchasevip"
                                    className={`hover:text-blue-400 ${location.pathname === "/purchasevip" ? "text-blue-500 font-bold" : ""}`}
                                >
                                    Purchase VIP
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/myprescriptions"
                                    className={`hover:text-blue-400 ${location.pathname === "/myprescriptions" ? "text-blue-500 font-bold" : ""}`}
                                >
                                    Prescriptions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/mycoins"
                                    className={`hover:text-blue-400 ${location.pathname === "/mycoins" ? "text-blue-500 font-bold" : ""}`}
                                >
                                    Coins
                                </a>
                            </li>
                        </ul>
                        {/* User Profile Image and Logout Button */}
                        <div className="flex items-center space-x-3">
                            {
                                user.gender === "Male" ? (
                                    <img
                                        className={`rounded-full w-10 h-10 object-cover border-2 ${user.vip.level === 'Gold'
                                            ? 'border-yellow-500'   // Gold border
                                            : user.vip.level === 'Silver'
                                                ? 'border-gray-300'    // Silver border
                                                : user.vip.level === 'Bronze'
                                                    ? 'border-orange-500'  // Bronze border
                                                    : 'border-transparent' // Default if no level is set
                                            }`}
                                        src={Male}
                                        alt="Male Avatar"
                                    />

                                ) : (
                                    <img
                                        className={`rounded-full w-10 h-10 object-cover border-4 ${user.vip.level === 'gold'
                                            ? 'border-yellow-500'   // Gold border
                                            : user.vip.level === 'silver'
                                                ? 'border-gray-300'    // Silver border
                                                : user.vip.level === 'bronze'
                                                    ? 'border-orange-500'  // Bronze border
                                                    : 'border-transparent' // Default if no level is set
                                            }`}
                                        src={Female}
                                        alt="Female Avatar"
                                    />

                                )
                            }
                            <div className="flex items-center space-x-1">
                                <img src={coin} alt="Coin" className="w-5 h-5" />
                                <span className="text-white text-sm font-semibold">{user.balance}</span>
                            </div>
                            <button className="text-white px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={logout}>

                                Logout
                            </button>
                        </div>

                        {/* Hamburger Menu - Visible on small screens */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-white">
                                <i className="fas fa-bars"></i> {/* Add a hamburger icon */}
                            </button>
                        </div>

                        {/* Mobile Menu - Hidden by default, shown when toggled */}
                        <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-NavColor p-4`}>
                            <ul className="space-y-4 text-white">
                                <li>
                                    <a
                                        href="/predict"
                                        className={`hover:text-blue-400 ${location.pathname === "/predict" ? "text-blue-500 font-bold" : ""}`}
                                    >
                                        Predict
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/chat"
                                        className={`hover:text-blue-400 ${location.pathname === "/chat" ? "text-blue-500 font-bold" : ""}`}
                                    >
                                        Chat
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/purchasevip"
                                        className={`hover:text-blue-400 ${location.pathname === "/purchasevip" ? "text-blue-500 font-bold" : ""}`}
                                    >
                                        Purchase VIP
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/myprescriptions"
                                        className={`hover:text-blue-400 ${location.pathname === "/myprescriptions" ? "text-blue-500 font-bold" : ""}`}
                                    >
                                        Prescriptions
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/mycoins"
                                        className={`hover:text-blue-400 ${location.pathname === "/mycoins" ? "text-blue-500 font-bold" : ""}`}
                                    >
                                        Coins
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>




                </>
            }
        </>

    )
}

export default Nav