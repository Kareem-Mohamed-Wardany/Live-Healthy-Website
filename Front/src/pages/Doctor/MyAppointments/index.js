import React, { useState, useEffect } from 'react'
import Pagination from "../../../components/Pagination";
import Limiting from "../../../components/Pagination/Limiting/Limiting";
import { useAppContext } from "../../../provider/index";
import Nav from "../../../components/Nav/index";
import AppointmentCard from '../../../components/AppointmentCard';
import { useNavigate } from 'react-router-dom';

const MyAppointments = (props) => {
    const { createNotification } = useAppContext()
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [limitChanged, setLimitChanged] = useState(true);

    const handleCancel = async (id, e) => {
        console.log(e.target.name)
        e.preventDefault();
        if (e.target.name === 'cancel') {
            // Prevent the default form behavior
            // Send the DELETE request to the backend
            let res = await fetch(`http://localhost:8080/appointment/cancel/${id}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Authorization header
                }
            });

            res = await res.json();

            // Check if the deletion was successful
            if (res.statusCode !== 200) {
                createNotification(res.msg, "error");
            } else {
                createNotification(res.msg, "success");

                // Check if the deleted item was the last on the current page
                const lastItemOnPage = appointments.length === 1; // If only 1 item is on the current page

                // If it's the last item, decrement the current page and fetch the previous page
                if (lastItemOnPage && currentPage > 1) {
                    fetchData(currentPage - 1);  // Fetch the previous page
                } else {
                    fetchData(currentPage);  // Otherwise, just re-fetch the current page
                }
            }
        }
        else {
            let res = await fetch(`http://localhost:8080/appointment/finish/${id}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Authorization header
                }
            });

            res = await res.json();

            // Check if the deletion was successful
            if (res.statusCode !== 200) {
                createNotification(res.msg, "error");
            } else {
                createNotification(res.msg, "success");
                // Check if the deleted item was the last on the current page
                const lastItemOnPage = appointments.length === 1; // If only 1 item is on the current page

                // If it's the last item, decrement the current page and fetch the previous page
                if (lastItemOnPage && currentPage > 1) {
                    fetchData(currentPage - 1);  // Fetch the previous page
                } else {
                    fetchData(currentPage);  // Otherwise, just re-fetch the current page
                }

                setTimeout(() => {
                    navigate(0);
                }, 3000);

            }
        }

    };

    const fetchData = async (page) => {
        setIsLoading(true);

        // http://localhost:8080/admin/centers?page=${page}&limit=10
        const response = await fetch(`http://localhost:8080/appointment/myappointments?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Authorization header
            }
        });
        const data = await response.json();
        if (data.statusCode === 200) {
            setAppointments(data.data.appointments);
            setTotalPages(data.data.metaData.totalPages);
            setLimitChanged(false);
        } // Reset the limit changed flag when the page changes
        else {
            createNotification(data.msg, "error");
        }
        setIsLoading(false);

    };


    useEffect(() => {
        if (limitChanged)
            setCurrentPage(1)
        fetchData(currentPage);
    }, [currentPage, limit, limitChanged]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Nav user={props.user} />
            {isLoading &&
                <p className="text-center text-xl font-semibold text-gray-600 animate-pulse">
                    Loading...
                </p>
            }
            {!isLoading && (
                <>
                    {
                        appointments.length === 0 ?
                            <>
                                <p className="text-center text-xl font-semibold text-gray-600 center">
                                    No Appointments found.
                                </p>
                            </>
                            :
                            <>
                                <div className="p-6 flex flex-col justify-center items-center">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                        My Appointments
                                    </h1>
                                    <Limiting currentLimit={limit} onLimitChange={setLimit} LimitChanged={setLimitChanged} text="Appointments Per Page:" />
                                    <div className="flex flex-wrap gap-6">
                                        {appointments.map((appointment, index) => (
                                            <AppointmentCard key={index}
                                                _id={appointment._id}
                                                patientId={appointment.patientId}
                                                reason={appointment.reason}
                                                appointmentTime={appointment.appointmentTime}
                                                appointmentDate={appointment.appointmentDate}
                                                handlebtn={handleCancel}
                                                cancel={true}
                                            />
                                        ))}
                                    </div>
                                    {/* Pagination Component */}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                    }
                </>
            )
            }

        </>
    );
};

export default MyAppointments