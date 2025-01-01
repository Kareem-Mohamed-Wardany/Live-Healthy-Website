import React, { useState, useEffect } from "react";
import Nav from "../../../components/Nav/index";
import Pagination from "../../../components/Pagination";
import Limiting from "../../../components/Pagination/Limiting/Limiting";
import { useAppContext } from "../../../provider/index";
import Male from "../../../assets/images/Male.png"
import Female from "../../../assets/images/Female.png"
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Doctors = (props) => {
    const { createNotification } = useAppContext()
    const [doctors, setDoctors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [limitChanged, setLimitChanged] = useState(true);


    const fetchData = async (page) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/admin/doctors?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Authorization header
                }
            });
            const data = await response.json();
            setDoctors(data.data.doctors);
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

    const handleDelete = async (id) => {
        // Send the DELETE request to the backend
        let res = await fetch(`http://localhost:8080/admin/doctors/${id}`, {
            method: "DELETE",
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
            const lastItemOnPage = doctors.length === 1; // If only 1 item is on the current page

            // If it's the last item, decrement the current page and fetch the previous page
            if (lastItemOnPage && currentPage > 1) {
                fetchData(currentPage - 1);  // Fetch the previous page
            } else {
                fetchData(currentPage);  // Otherwise, just re-fetch the current page
            }
        }
    };

    const handleVerify = async (id) => {
        // Send the DELETE request to the backend
        let res = await fetch(`http://localhost:8080/admin/verify/${id}`, {
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
            fetchData(currentPage);
        }
    };


    return (
        <>
            <Nav user={props.user} />
            <div className="p-4 flex flex-col items-center">
                {isLoading ? (
                    <p className="text-center text-xl font-semibold text-gray-600 animate-pulse">
                        Loading...
                    </p>
                ) : (
                    <>
                        {/* No Radiology Centers Found Message */}
                        {doctors.length === 0 ? (
                            <p className="text-center text-xl font-semibold text-gray-600">
                                No Doctors found.
                            </p>
                        ) : (
                            <>
                                {/* Limiting Component */}
                                <Limiting currentLimit={limit} onLimitChange={setLimit} LimitChanged={setLimitChanged} text="Doctors Per Page:" adv="true" />

                                {/* Flex container of Radiology Centers */}
                                <div className="mb-4 flex flex-wrap gap-6">
                                    {doctors.map((docData) => (
                                        <div className="p-4 flex justify-center">
                                            <div className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden">
                                                {/* Doctor Image (Optional) */}
                                                <div className="flex justify-center py-4">
                                                    <>
                                                        {docData.gender === "Male" ? (
                                                            <img
                                                                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                                                                src={Male}
                                                                alt="Male Avatar"
                                                            />
                                                        ) : (
                                                            <img
                                                                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"

                                                                src={Female}
                                                                alt="Female Avatar"
                                                            />
                                                        )}
                                                    </>
                                                </div>

                                                {/* Doctor Details */}
                                                <div className="px-6 py-4">
                                                    <h2 className="text-2xl font-bold text-gray-800 text-center">{docData.name}</h2>
                                                    <p className="text-lg text-gray-600 text-center">{docData.accountType}</p>

                                                    {/* University */}
                                                    <p className="mt-2 text-gray-800">
                                                        <span className="font-semibold">University:</span> {docData.docData.university}
                                                    </p>

                                                    {/* Contact Info */}
                                                    <p className="mt-2 text-gray-800">
                                                        <span className="font-semibold">Phone:</span> {docData.phone}
                                                    </p>
                                                    <p className="mt-1 text-gray-800">
                                                        <span className="font-semibold">Email:</span> {docData.mail}
                                                    </p>

                                                    {/* Verification Status */}
                                                    <div className="mt-4">
                                                        <p className="text-sm font-semibold">Verification Status:</p>
                                                        <span
                                                            className={`inline-block mt-2 px-3 py-1 rounded-full ${docData.docData.verified ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                                                }`}
                                                        >
                                                            {/* Verified Status */}
                                                            {docData.docData.verified ? (
                                                                <>
                                                                    <CheckCircleIcon className="w-5 h-5 inline-block mr-1" />
                                                                    Verified
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircleIcon className="w-5 h-5 inline-block mr-1" />
                                                                    Not Verified
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* ID and Professional License */}
                                                    <div className="mt-4 space-y-2">
                                                        <p className="text-gray-800">
                                                            <span className="font-semibold">ID Front:</span>{" "}
                                                            <a
                                                                href={`http://localhost:8080/${docData.docData.IDFront}`}
                                                                className="text-blue-500 underline"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View
                                                            </a>
                                                        </p>
                                                        <p className="text-gray-800">
                                                            <span className="font-semibold">ID Back:</span>{" "}
                                                            <a
                                                                href={`http://localhost:8080/${docData.docData.IDBack}`}
                                                                className="text-blue-500 underline"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View
                                                            </a>
                                                        </p>
                                                        <p className="text-gray-800">
                                                            <span className="font-semibold">Profession License Front:</span>{" "}
                                                            <a
                                                                href={`http://localhost:8080/${docData.docData.ProfFront}`}
                                                                className="text-blue-500 underline"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View
                                                            </a>
                                                        </p>
                                                        <p className="text-gray-800">
                                                            <span className="font-semibold">Profession License Back:</span>{" "}
                                                            <a
                                                                href={`http://localhost:8080/${docData.docData.ProfBack}`}
                                                                className="text-blue-500 underline"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Button (Optional) */}
                                                <div className="px-6 py-4 flex justify-center space-x-4">
                                                    <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDelete(docData._id);
                                                        }}>
                                                        Delete
                                                    </button>
                                                    {!docData.docData.verified && (

                                                        <>
                                                            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleVerify(docData._id);
                                                                }}>
                                                                Verify
                                                            </button>
                                                        </>
                                                    )}

                                                </div>

                                            </div>
                                        </div>

                                    ))}
                                </div>

                                {/* Pagination Component */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </>
                )}
            </div>


        </>
    );
};

export default Doctors;