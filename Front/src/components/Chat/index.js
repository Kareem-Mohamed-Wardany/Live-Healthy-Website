import React, { useEffect, useRef } from "react";

const ChatComponent = (props) => {
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [props.chat.messages]);
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            props.handleSendMessage();
        }
    };

    const handleEnd = () => {
        props.setEndChat(true)
    }

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-center mb-4">Chat with {props.name}</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm max-h-96 overflow-y-auto mb-4">
                {props.chat.messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 p-3 rounded-lg ${msg.sender === props.userId ? 'bg-green-100 text-green-800 ml-12' : 'bg-gray-100 text-gray-800'}`}
                    >
                        <strong>{msg.sender === props.userId ? "You" : props.name}:</strong>
                        <p className="text-lg">{msg.message}</p>
                        <div className="text-sm text-gray-500 text-right">{new Date(msg.timestamp).toLocaleString()}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center">
                <input
                    type="text"
                    value={props.message}
                    onChange={(e) => props.setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                    onClick={props.handleSendMessage}
                    className="ml-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
                >
                    Send
                </button>
                <button
                    onClick={handleEnd}
                    className="ml-3 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                >
                    End
                </button>
            </div>
        </div>
    )
}

export default ChatComponent