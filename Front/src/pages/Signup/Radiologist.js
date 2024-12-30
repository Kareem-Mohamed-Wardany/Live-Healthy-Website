import React from 'react'
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useState, useEffect } from 'react';

const Radiologist = (props) => {
    //   Radiologist Data
    const [center, setCenter] = useState("");
    const [code, setCode] = useState("");
    // Fetch RadioCenters
    const [radioCenters, setRadioCenters] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/radiology-center/centers"
                );
                if (res.status === 200) {
                    setRadioCenters(res.data.data);
                    console.log(res);
                }
            } catch (error) {
                props.createNotification("Error fetching radiology centers", "error");
                console.error("Error fetching radiology centers:", error);
            }
        };

        fetchData();
    }, [props.accountType]);

    const valid = () => {
        if (!center) {
            props.createNotification("Center Name is required", "error");
            return false;
        }
        if (!code) {
            props.createNotification("Center Name is required", "error");
            return false;
        }
        return true
    }
    const handleButtonClick = async (e) => {
        e.preventDefault();
        if (!props.validate() || !valid())
            return
        let res;
        if (props.accountType === "radiologist") {
            res = await fetch("http://localhost:8080/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mail: props.email,
                    password: props.password,
                    name: props.firstName + " " + props.lastName,
                    accountType: props.accountType,
                    phone: props.phoneNumber,
                    dateOfBirth: new Date(props.startDate),
                    gender: props.gender,
                    centerName: center,
                    code: code,
                }),
            })
        }
        res = await res.json()
        console.log(res)
        if (res.status === 201) {
            props.createNotification("Account Created Successfully", "success");
            props.navigate("/");
        } else {
            console.log(res)
            props.createNotification(res.msg, "error");
        }

        // Add your validation and submission logic here
    };



    return (
        <>
            <label className="text-3xl font-semibold mb-6 text-gray-800 text-center">General Information</label>
            <select
                className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
                name="radiologyCenter"
                onChange={(e) => {
                    setCenter(e.target.value);
                }}
            >
                <option value="invalid" disabled selected>
                    Radiology Center
                </option>
                {radioCenters?.map((c) => (
                    <option value={c.name} key={c._id.toString()}>
                        {c.name}
                    </option>
                ))}
            </select>

            <input
                className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
                type="text"
                placeholder="Verification Code"
                onChange={(e) => {
                    setCode(e.target.value);
                }}
            />
            <button
                onClick={handleButtonClick}
                className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                Sign up
            </button>
        </>

    )
}

export default Radiologist