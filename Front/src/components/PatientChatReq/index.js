import React, { useState } from 'react';
import { useAppContext } from '../../provider';
import { useNavigate } from 'react-router-dom';

const ChatRequest = (props) => {
    const [message, setMessage] = useState(props.message);
    const { createNotification } = useAppContext();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = await fetch("http://localhost:8080/chat/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                reason: message
            })
        })
        res = await res.json()
        if (res.statusCode === 201) {
            createNotification(res.msg, "success");
            props.setFound(true)
            setTimeout(() => {
                navigate(0);
            }, 3000);

        }
        else {
            createNotification(res.msg, "error");
        }
    };


    return (
        <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Chat Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    disabled={props.found}
                    value={message}
                    onChange={(e) => { setMessage(e.target.value) }}
                    placeholder={props.found ? "Your Request is sent" : "Type your message..."}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={props.found}
                    >
                        {props.found ? "Pending" : "Send Message"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatRequest;
