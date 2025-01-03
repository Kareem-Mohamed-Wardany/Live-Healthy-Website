import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../provider';
import formatDate from '../../util/formateData';
import { useNavigate } from 'react-router-dom';

const PatientAppointmentForm = () => {
    const { createNotification } = useAppContext();
    const [found, setFound] = useState(false);
    const [appointmentData, setAppointmentData] = useState({});
    const navigate = useNavigate();

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
                setAppointmentData(res.data);
                setFound(true);
            }
        }
        fetchdata();
    }, [found]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = await fetch("http://localhost:8080/appointment/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(appointmentData)
        })
        res = await res.json()
        if (res.statusCode === 201) {
            createNotification(res.msg, "success");
            setFound(true)
            setTimeout(() => {
                navigate(0);
            }, 3000);
        }
        else {
            createNotification(res.msg, "error");
        }
    };



    const handleChange = (e) => {
        if (!found) {
            const { name, value } = e.target;
            setAppointmentData({
                ...appointmentData,
                [name]: value,
            });
        };
    }

    const getButtonClass = () => {
        const baseClass =
            "w-full py-2 px-4 text-white font-semibold rounded-md shadow-md focus:ring-2 focus:outline-none";
        switch (appointmentData.status) {
            case "pending":
                return `${baseClass} bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400`;
            case "accepted":
                return `${baseClass} bg-green-600 hover:bg-green-700 focus:ring-green-500`;
            default: // Default for "Book Appointment" or any other status
                return `${baseClass} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
        }
    };



    return (
        <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 mt-8 ">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-900 mb-2">
                    {found ? "Appointment Booked" : "Book an Appointment"}
                </h2>
                {found && <>
                    {appointmentData.status === 'accepted' &&
                        <>
                            <div >
                                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Doctor Details</h2>

                                {/* Doctor Name */}
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                                    <input
                                        disabled={found}
                                        type="text"
                                        value={appointmentData.doctorId.name}
                                        className={`mt-1 block w-full border rounded-md shadow-sm ${found ? "bg-gray-100 cursor-not-allowed" : "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"}`}
                                    />
                                </div>

                                {/* Doctor Address */}
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Address</label>
                                    <input
                                        disabled={found}
                                        type="text"
                                        value={appointmentData.doctorId.address}
                                        className={`mt-1 block w-full border rounded-md shadow-sm ${found ? "bg-gray-100 cursor-not-allowed" : "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"}`}
                                    />
                                </div>

                                {/* Doctor Phone */}
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Phone</label>
                                    <input
                                        disabled={found}
                                        type="text"
                                        value={appointmentData.doctorId.phone}
                                        className={`mt-1 block w-full border rounded-md shadow-sm ${found ? "bg-gray-100 cursor-not-allowed" : "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"}`}
                                    />
                                </div>

                                {/* Doctor E-mail */}
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor E-mail</label>
                                    <input
                                        disabled={found}
                                        type="text"
                                        value={appointmentData.doctorId.mail}
                                        className={`mt-1 block w-full border rounded-md shadow-sm ${found ? "bg-gray-100 cursor-not-allowed" : "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"}`}
                                    />
                                </div>
                            </div>
                        </>}
                </>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
                        Appointment  Details
                    </h2>
                    {/* Date Input */}
                    <div>
                        <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            disabled={found}
                            type={found ? "text" : "date"}
                            name="appointmentDate"
                            value={found ? formatDate(new Date(appointmentData.appointmentDate)) : appointmentData.appointmentDate}
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
                            value={appointmentData.appointmentTime}
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
                            value={appointmentData.reason}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${found ? "bg-gray-100 cursor-not-allowed resize-none" : "border-gray-300"
                                }`}
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="space-y-4">
                        {/* Button for Default State */}

                        <button
                            type="submit"
                            disabled={found}
                            className={getButtonClass()}
                        >
                            {found ?
                                appointmentData.status === "pending" ? "Appointment Pending"
                                    : appointmentData.status === "accepted"
                                        ? "Appointment Accepted"
                                        : "Book Appointment"
                                : "Book Appointment"}

                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default PatientAppointmentForm