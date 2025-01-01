import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../../assets/images/TitleImage.png";
import { useAppContext } from '../../../provider';

const ResetPassword = () => {
    const { createNotification } = useAppContext();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const location = useLocation();

    // Extract mail and token from the URL parameters
    const queryParams = new URLSearchParams(location.search);
    const mail = queryParams.get('email');
    const token = queryParams.get('token');

    useEffect(() => {
        if (!mail || !token) {
            setError('Invalid or missing mail/token.');
        }
    }, [mail, token]);

    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            createNotification("New Password Required", "error")
            return;
        }
        if (newPassword !== confirmPassword) {
            createNotification("Password does not match", "error")
            return;
        }

        let res = await fetch('http://localhost:8080/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail, token, newPassword }),
        })
        res = await res.json()

        if (res.statusCode === 200) {
            createNotification(res.msg, "success")
            setIsSuccess(true)
        }
        else {
            createNotification(res.msg, "error")
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto center">
            <Link to="/" className="flex justify-center mb-8">
                <img src={logo} alt="Live Healthy Logo" className="w-40 h-auto" />
            </Link>

            {isSuccess ? (
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-green-600">Your password has been successfully reset!</h2>
                    <p className="text-sm text-gray-600 mt-4">
                        You can now <Link to="/" className="text-blue-600 hover:underline">log in</Link> with your new password.
                    </p>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Enter a new password below to reset your password.
                    </p>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <div className="space-y-6">
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={handleSubmit}
                        >
                            Reset Password
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Go back to login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
