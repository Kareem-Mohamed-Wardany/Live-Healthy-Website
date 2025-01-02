import React, { useState, useEffect } from 'react'
import Pagination from "../../../components/Pagination";
import Limiting from "../../../components/Pagination/Limiting/Limiting";
import { useAppContext } from "../../../provider/index";
import Nav from "../../../components/Nav/index";
import AppointmentCard from '../../../components/AppointmentCar';

const AssignAppointment = (props) => {
    const { createNotification } = useAppContext()
    const [appointments, setAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [limitChanged, setLimitChanged] = useState(true);

    const handleAccept = async (id) => {
        // Send the DELETE request to the backend
        let res = await fetch(`http://localhost:8080/appointment/accept/${id}`, {
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
    };

    const fetchData = async (page) => {
        setIsLoading(true);
        try {
            // http://localhost:8080/admin/centers?page=${page}&limit=10
            const response = await fetch(`http://localhost:8080/appointment/pending-appointment?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Authorization header
                }
            });
            const data = await response.json();
            data.data.appointments.handleAccept = handleAccept
            setAppointments(data.data.appointments);
            console.log(appointments)
            setTotalPages(data.data.metaData.totalPages);
            setLimitChanged(false); // Reset the limit changed flag when the page changes
        } catch (error) {
            console.error("Error fetching radiology centers:", error);
        } finally {
            setIsLoading(false);
        }
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
            <div className="p-6 flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Appointments Overview
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
                            handlebtn={handleAccept}
                            cancel={false}

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
    );
};

export default AssignAppointment