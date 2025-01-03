import React, { useState, useEffect } from 'react'
import Pagination from "../../../components/Pagination";
import Limiting from "../../../components/Pagination/Limiting/Limiting";
import { useAppContext } from "../../../provider/index";
import Nav from "../../../components/Nav/index";
import ChatCard from '../../../components/ChatCard';
import { useNavigate } from 'react-router-dom';

const AllChats = (props) => {
    const { createNotification } = useAppContext()
    const navigate = useNavigate();
    const [chat, setChat] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [limitChanged, setLimitChanged] = useState(true);
    const handleNav = (id) => {
        navigate(`/${id}`)

    };
    const fetchData = async (page) => {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/chat/active-chat?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Authorization header
            }
        });
        const data = await response.json();
        if (data.statusCode === 200) {
            setChat(data.data.chats);
            setTotalPages(data.data.metaData.totalPages);
            setLimitChanged(false);
        }
        else
            createNotification(data.msg, "error");
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
                        chat.length === 0 ?
                            <>
                                <p className="text-center text-xl font-semibold text-gray-600 center">
                                    No Chats found.
                                </p>
                            </>
                            :
                            <>
                                <div className="p-6 flex flex-col justify-center items-center">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                        Chats Overview
                                    </h1>
                                    <Limiting currentLimit={limit} onLimitChange={setLimit} LimitChanged={setLimitChanged} text="Chats Per Page:" />
                                    <div className="flex flex-wrap gap-6">
                                        {chat.map((c, index) => (
                                            <ChatCard key={index}
                                                _id={c._id}
                                                patientId={c.patientId}
                                                reason={c.reason}
                                                handlebtn={handleNav}
                                                chat={true}
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

export default AllChats