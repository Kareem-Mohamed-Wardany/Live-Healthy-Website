import React, { useState } from 'react'
import logo from "../../assets/images/TitleImage.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from '../../provider';


const ForgetPassword = () => {
    const { createNotification } = useAppContext();
    const navigate = useNavigate();
    const [mail, setMail] = useState('')
    const handleSubmit = async () => {
        if (!mail) {
            createNotification("Email is required", "error")
            return
        }
        if (!/\S+@\S+\.\S+/.test(mail)) {
            createNotification("Email address is invalid", "error")
            return
        }
        // Send password reset email to the provided email address
        let res = await fetch('http://localhost:8080/auth/forget-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: mail
            })
        })
        res = await res.json()
        if (res.statusCode === 200) {
            createNotification("Password reset email sent successfully", "success")
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
        else {
            createNotification(res.msg, "error")
        }
    }
    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto center">
                <Link to="/" className="flex justify-center mb-6">
                    <img src={logo} alt="Live Healthy Logo" className="w-40 h-auto" />
                </Link>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Enter your registered email address below, and we will send you instructions to reset your password.
                </p>
                <div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
                            placeholder="Enter your email address"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                        />
                    </div>
                    <button
                        className="w-full py-3 mt-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>

    )
}

export default ForgetPassword