import React, { useState, useEffect } from 'react';
import Nav from '../../../components/Nav';
import { useAppContext } from '../../../provider';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import ChatComponent from '../../../components/Chat';
import PatientChatReq from '../../../components/PatientChatReq';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080');

export const Chat = ({ user }) => {
    const location = useLocation().pathname;
    const userId = user._id;
    const { createNotification } = useAppContext();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [found, setFound] = useState(false);
    const [endChat, setEndChat] = useState(false);
    const [chat, setChat] = useState({ participants: [], messages: [] });
    const [mychatData, setMyChatData] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchChatData = async () => {
            let res = await fetch('http://localhost:8080/chat/mychat',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
            res = await res.json();
            if (res.statusCode === 200) {
                setMyChatData(res.data);
                setFound(true);
            };
            setLoading(false);
        }
        fetchChatData();
    }, [createNotification]);

    useEffect(() => {
        if (!found || location !== '/chat' || mychatData.status !== 'active') return;

        const doctorId = mychatData.doctorId._id;

        // Notify server of user online status
        socket.emit('user-online', userId);
        const cid = mychatData._id

        // Fetch chat history
        socket.emit('get-chat-history', { cid });

        const handleChatHistory = (chatData) => {
            setChat(chatData);
        };

        const handleReceiveMessage = (newMessage) => {
            setChat((prevChat) => ({
                ...prevChat,
                messages: [...prevChat.messages, newMessage],
            }));
        };

        // Register socket event listeners
        socket.on('chat-history', handleChatHistory);
        socket.on('receive-message', handleReceiveMessage);

        if (endChat) {
            socket.emit("endChatRequest", { chatId: cid, userId: userId });
            navigate("/");
        }

        return () => {
            // Clean up event listeners
            socket.off('chat-history', handleChatHistory);
            socket.off('receive-message', handleReceiveMessage);
        };
    }, [found, location, mychatData, userId, endChat]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        const doctorId = mychatData.doctorId._id;

        // Emit the message to the server
        socket.emit('send-message', {
            id: mychatData._id,
            sender: userId,
            receiver: doctorId,
            message,
        });

        // Optimistically update the chat UI
        setChat((prevChat) => ({
            ...prevChat,
            messages: [
                ...prevChat.messages,
                { sender: userId, message, timestamp: new Date().toISOString() },
            ],
        }));

        setMessage(''); // Clear the input field
    };

    if (loading) {
        return (
            <p className="text-center text-xl font-semibold text-gray-600 animate-pulse">
                Loading...
            </p>
        );
    }

    return (
        <>
            <Nav user={user} />
            {!found ? (
                <PatientChatReq
                    found={found}
                    setFound={setFound}
                    message={mychatData.reason}
                />
            ) : (
                <>
                    {mychatData.status === 'pending' && (
                        <PatientChatReq found={found} setFound={setFound} />
                    )}
                    {mychatData.status === 'active' && (
                        <ChatComponent
                            userId={userId}
                            contactId={mychatData.doctorId}
                            chat={chat}
                            handleSendMessage={handleSendMessage}
                            message={message}
                            setMessage={setMessage}
                            name={mychatData.doctorId?.name || 'Unknown'}
                            setEndChat={setEndChat}
                            endChat={endChat}
                        />
                    )}
                </>
            )}
        </>
    );
};
