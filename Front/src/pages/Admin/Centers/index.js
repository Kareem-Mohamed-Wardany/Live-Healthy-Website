import React, { useState, useEffect } from "react";
import Nav from "../../../components/Nav/index";
import centerimg from "../../../assets/images/radioCenter.png"
import Pagination from "../../../components/Pagination";
import Limiting from "../../../components/Pagination/Limiting/Limiting";
import { useAppContext } from "../../../provider/index";

const RadiologyCentersList = (props) => {
    const { createNotification } = useAppContext()
    const [radiologyCenters, setRadiologyCenters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [limitChanged, setLimitChanged] = useState(true);

    const fetchData = async (page) => {
        setIsLoading(true);
        try {
            // http://localhost:8080/admin/centers?page=${page}&limit=10
            const response = await fetch(`http://localhost:8080/admin/centers?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Authorization header
                }
            });
            const data = await response.json();
            setRadiologyCenters(data.data.centers);
            setTotalPages(data.data.metaData.totalPages);
            setLimitChanged(false); // Reset the limit changed flag when the page changes
        } catch (error) {
            console.error("Error fetching radiology centers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // Send the DELETE request to the backend
        let res = await fetch(`http://localhost:8080/admin/centers/${id}`, {
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
            const lastItemOnPage = radiologyCenters.length === 1; // If only 1 item is on the current page

            // If it's the last item, decrement the current page and fetch the previous page
            if (lastItemOnPage && currentPage > 1) {
                fetchData(currentPage - 1);  // Fetch the previous page
            } else {
                fetchData(currentPage);  // Otherwise, just re-fetch the current page
            }
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
            <div className="p-4 flex flex-col items-center">
                {isLoading ? (
                    <p className="text-center text-xl font-semibold text-gray-600 animate-pulse">
                        Loading...
                    </p>
                ) : (
                    <>
                        {/* No Radiology Centers Found Message */}
                        {radiologyCenters.length === 0 ? (
                            <p className="text-center text-xl font-semibold text-gray-600">
                                No Radiology Centers found.
                            </p>
                        ) : (
                            <>
                                {/* Limiting Component */}
                                <Limiting currentLimit={limit} onLimitChange={setLimit} LimitChanged={setLimitChanged} text="Centers Per Page:" />

                                {/* Flex container of Radiology Centers */}
                                <div className="mb-4 flex flex-wrap gap-6">
                                    {radiologyCenters.map((center) => (
                                        <div
                                            key={center.id}
                                            className="p-4 bg-white shadow-md rounded-lg hover:shadow-xl hover:scale-105 transition-transform transition-shadow duration-300 flex flex-col items-center"
                                        >
                                            {/* Center Image */}
                                            <img
                                                src={centerimg}
                                                alt={center.name}
                                                className="w-full h-48 object-cover rounded-md mb-4"
                                            />

                                            {/* Center Name */}
                                            <h2 className="text-xl font-bold text-gray-800 mb-2">{center.name}</h2>

                                            {/* Center Address */}
                                            <h3 className="text-gray-600 mb-4">{center.address}</h3>

                                            {/* Delete Button */}
                                            <button
                                                key={center.id}
                                                className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDelete(center._id);
                                                }}
                                            >
                                                Delete
                                            </button>
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

export default RadiologyCentersList;
