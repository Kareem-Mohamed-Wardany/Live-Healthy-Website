import React from "react";

const Limiting = ({ currentLimit, onLimitChange, LimitChanged, text }) => {
    const options = [2, 5, 10, 15, 20, 25]; // Define the limits

    return (
        <div className="flex items-center space-x-2 mb-5">
            <label htmlFor="limit" className="text-sm font-medium text-gray-700">
                {text}
            </label>
            <select
                id="limit"
                value={currentLimit}
                onChange={(e) => {
                    onLimitChange(Number(e.target.value))
                    LimitChanged(true)

                }}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>

    );
};

export default Limiting;
