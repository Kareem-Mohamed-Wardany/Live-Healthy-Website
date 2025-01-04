import React, { useState, useEffect } from 'react';
import Nav from '../../../components/Nav';
import { useAppContext } from '../../../provider';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import ChatComponent from '../../../components/Chat';

const socket = io('http://localhost:8080');

const DChat = (props) => {
    const user = props.user;
    const userId = user._id;
    const { id } = useParams();
    const chatId = id;
    const { createNotification } = useAppContext();
    const navigate = useNavigate();

    const [found, setFound] = useState(false);
    const [endChat, setEndChat] = useState(false);
    const [chatDetails, setChatDetails] = useState({});
    const [chat, setChat] = useState({ messages: [] });
    const [message, setMessage] = useState('');

    // Fetch chat details
    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/chat/${chatId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.data.statusCode === 200) {
                    setChatDetails(res.data.data);
                    setFound(true);
                }
            } catch (error) {
                console.error('Failed to fetch chat details:', error);
                createNotification('Failed to load chat details', 'error');
            }
        };

        fetchChatDetails();
    }, [chatId, createNotification]);

    // Socket-related logic
    useEffect(() => {
        if (!found || !chatDetails.patientId) return;

        // Notify server of user online status
        socket.emit('user-online', userId);

        const cid = chatId
        // Fetch chat history
        socket.emit('get-chat-history', { cid });

        // Event listener for chat history
        const handleChatHistory = (chatData) => {
            setChat(chatData);
        };
        socket.on('chat-history', handleChatHistory);

        // Event listener for new messages
        const handleReceiveMessage = (newMessage) => {
            setChat((prevChat) => ({
                ...prevChat,
                messages: [...prevChat.messages, newMessage],
            }));
        };
        socket.on('receive-message', handleReceiveMessage);

        if (endChat) {
            socket.emit("endChatRequest", { chatId: chatId, userId: userId });
            navigate("/");
        }

        return () => {
            // Clean up listeners
            socket.off('chat-history', handleChatHistory);
            socket.off('receive-message', handleReceiveMessage);
        };
    }, [userId, found, chatDetails.patientId, endChat, chatId]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        // Emit message to the server
        socket.emit('send-message', {
            id: chatId,
            sender: userId,
            receiver: chatDetails.patientId._id,
            message,
        });

        // Optimistically update chat UI
        setChat((prevChat) => ({
            ...prevChat,
            messages: [
                ...prevChat.messages,
                { sender: userId, message, timestamp: new Date().toISOString() },
            ],
        }));

        setMessage(''); // Clear input field
    };

    return (
        <>
            <Nav user={user} />

            {found && chatDetails.patientId ? (
                <ChatComponent
                    userId={userId}
                    contactId={chatDetails.patientId}
                    chat={chat}
                    handleSendMessage={handleSendMessage}
                    message={message}
                    setMessage={setMessage}
                    name={chatDetails.patientId.name || 'Unknown'}
                    setEndChat={setEndChat}
                    endChat={endChat}
                />
            ) : (
                <p>Loading chat...</p>
            )}
        </>
    );
};

export default DChat;
