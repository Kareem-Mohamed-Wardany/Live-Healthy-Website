import React, { useState, useEffect } from 'react'
import Nav from '../../../components/Nav'
import { useAppContext } from '../../../provider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Appointment = (props) => {
    const user = props.user
    const navigate = useNavigate();
    const { createNotification } = useAppContext();
    const [found, setFound] = useState(false);
    const [appointmentStatus, setAppointmentStatus] = useState("");
    const [formData, setFormData] = useState({
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
    });

    useEffect(() => {
        // fetch appointment data from server
        const fetchdata = async () => {
            let res = await fetch("http://localhost:8080/appointment/myappointment",
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            res = await res.json()
            if (res.statusCode === 200) {
                setFormData(res.data);
                setFound(true);
                setAppointmentStatus(res.data.status)
            }
        }
        fetchdata();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = await fetch("http://localhost:8080/appointment/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        })
        res = await res.json()
        if (res.statusCode === 201) {
            createNotification("Appointment booked successfully", "success");
            setFound(true)
            setAppointmentStatus("pending")
        }
        else {
            createNotification(res.msg, "error");
        }

    };
    return (
        <>
            <Nav user={user} />
            <div className="flex justify-center items-center min-h-screenpx-4 sm:px-6 lg:px-8 mt-28 ">
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
                        {found ? "Appointment Booked" : "Book an Appointment"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Date Input */}
                        <div>
                            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                disabled={found}
                                type="date"
                                id="appointmentDate"
                                name="appointmentDate"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${found ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                    }`}
                                required
                            />
                        </div>

                        {/* Time Input */}
                        <div>
                            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                                Time
                            </label>
                            <input
                                disabled={found}
                                type="time"
                                id="appointmentTime"
                                name="appointmentTime"
                                value={formData.appointmentTime}
                                onChange={handleChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${found ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                    }`}
                                required
                            />
                        </div>

                        {/* Reason for Appointment */}
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                Reason for Appointment
                            </label>
                            <textarea
                                disabled={found}
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${found ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                    }`}
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="space-y-4">
                            {/* Button for Pending Appointment */}
                            {appointmentStatus === "pending" && (
                                <button
                                    type="submit"
                                    disabled={found}
                                    className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-md ${found
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                        }`}
                                >
                                    Appointment Pending
                                </button>
                            )}

                            {/* Button for Accepted Appointment */}
                            {appointmentStatus === "accepted" && (
                                <button
                                    type="submit"
                                    disabled
                                    className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-md cursor-not-allowed bg-green-500  focus:ring-2 focus:ring-green-400 focus:outline-none"
                                        }`}
                                >
                                    Appointment Accepted
                                </button>
                            )}

                            {/* Button for Default State */}
                            {appointmentStatus === "" && (
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 text-white font-semibold rounded-md shadow-md bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    Book Appointment
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>

        </>
    )
}
