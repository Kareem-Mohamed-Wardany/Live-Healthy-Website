import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppContext, useAuthContext } from "../../../provider/index";

import Nav from "../../../components/Nav/index";

const AddCenter = (props) => {
    const { createNotification, setIsLoading } = useAppContext();
    const [data, setData] = useState({ name: "", address: "", mail: "", phone: "" });

    const navigate = useNavigate();

    const validate = () => {
        if (!data.name) {
            createNotification("Center Name is required", "error");
            return false;
        }
        if (!data.address) {
            createNotification("Center Address is required", "error");
            return false;
        }
        if (!data.mail) {
            createNotification("Email is required", "error");
            return false;
        }
        if (!data.phone) {
            createNotification("Center Phone is required", "error");
            return false;
        }
        return true;
    }
    const handdleButtonClick = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        let res = await fetch("http://localhost:8080/admin/add-center", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Authorization header
            },
            body: JSON.stringify(data),
        })
        res = await res.json()
        console.log(res)
        if (res.statusCode !== 201) {
            createNotification(res.msg, "error");
            return;
        }
        else {
            createNotification(res.msg, "success");
            setTimeout(() => {
                navigate("/centers");
            }, 3000);
        }
    }
    return (
        <>
            <Nav user={props.user} />
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto center">
                <div>
                    <div className="flex flex-col mb-2">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Center Name</label>
                        <input
                            className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            type="text"
                            placeholder="Center Name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col mb-2">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Center Address</label>
                        <input
                            className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            type="text"
                            placeholder="Center Address"
                            value={data.address}
                            onChange={(e) => setData({ ...data, address: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col mb-2">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Center Email</label>
                        <input
                            className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            type="text"
                            placeholder="Center Email"
                            value={data.mail}
                            onChange={(e) => setData({ ...data, mail: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col mb-2">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Center Phone</label>
                        <input
                            className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            type="text"
                            placeholder="Center Phone"
                            value={data.phone}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                        />
                    </div>
                </div>
                <div className="my-3 flex justify-evenly w-full">
                    <button
                        onClick={handdleButtonClick}
                        className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        Add Center
                    </button>
                </div>
            </div >
        </>

    )
}

export default AddCenter