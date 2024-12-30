import React from 'react'
import { useState } from 'react';
import axios from 'axios';


const Doctor = (props) => {
    //   specialist or consultant Data
    const [university, setUniversity] = useState("");
    const [imagePreview, setImagePreview] = useState({});
    const [files, setFiles] = useState({});
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        setFiles((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.files[0],
        }))
        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview((prevState) => ({
                ...prevState,
                [e.target.name]: reader.result,
            }));
        };

        // Read the file as base64 (Data URL)
        reader.readAsDataURL(file);
    };
    const valid = () => {
        if (!university) {
            props.createNotification("University is required", "error");
            return false;
        }
        if (!files.IDFront) {
            props.createNotification("Front of ID is required", "error");
            return false;
        }
        if (!files.IDBack) {
            props.createNotification("Back of ID is required", "error");
            return false;
        }
        if (!files.ProfessionLicenseFront) {
            props.createNotification("Front of Profession License is required", "error");
            return false;
        }
        if (!files.ProfessionLicenseBack) {
            props.createNotification("Back of Profession License is required", "error");
            return false;
        }

        return true
    }

    const handleButtonClick = async (e) => {
        e.preventDefault();
        if (!props.validate() || !valid())
            return
        let res;
        const formData = new FormData();
        formData.append("mail", props.email);
        formData.append("password", props.password);
        formData.append("name", `${props.firstName} ${props.lastName}`);
        formData.append("accountType", props.accountType);
        formData.append("phone", props.phoneNumber);
        formData.append("dateOfBirth", new Date(props.startDate));
        formData.append("gender", props.gender);
        formData.append("university", university);
        formData.append("IDFront", files.IDFront);
        formData.append("IDBack", files.IDBack);
        formData.append("ProfessionLicenseFront", files.ProfessionLicenseFront);
        formData.append("ProfessionLicenseBack", files.ProfessionLicenseBack);

        res = await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            body: formData, // Pass FormData directly
            // Do NOT manually set "Content-Type"
        });

        res = await res.json()
        if (res.statusCode === 201) {
            props.createNotification("Account Created Successfully", "success");
            props.navigate("/");
        } else {
            console.log(res)
            props.createNotification(res.msg, "error");
        }
        // Add your validation and submission logic here
    };


    return (
        <div >
            <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Upload Documents</h1>

            {/* University Input */}
            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="university">
                    University
                </label>
                <input
                    id="university"
                    className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                    type="text"
                    name="University"
                    placeholder="Enter your university"
                    onChange={(e) => setUniversity(e.target.value)}
                />
            </div>

            {/* File Uploads */}
            {[
                { name: "IDFront", label: "ID Front" },
                { name: "IDBack", label: "ID Back" },
                { name: "ProfessionLicenseFront", label: "Profession License Front" },
                { name: "ProfessionLicenseBack", label: "Profession License Back" },
            ].map(({ name, label }) => (
                <div className="mb-6" key={name}>
                    <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor={name}>
                        {label}
                    </label>
                    <div className="flex items-center gap-4">
                        {/* Image Preview */}
                        {imagePreview[name] && (
                            <img
                                src={imagePreview[name]}
                                alt={`${label} Preview`}
                                className="rounded-lg border border-gray-200 shadow-sm w-32 h-auto"
                            />
                        )}
                        {/* File Input */}
                        <input
                            id={name}
                            className="text-sm w-full max-w-xs p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            type="file"
                            name={name}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            ))}

            {/* Submit Button */}
            <div className="mt-8 text-center">
                <button
                    className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    type="button"
                    onClick={handleButtonClick}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}
export default Doctor
/* <input
            className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2"
            type="text"
            name="University"
            placeholder="University"
            onChange={(e) => {
                setUniversity(e.target.value);
            }}
        />
        <label className="text-xl self-start">ID Front</label>
        <div className="flex w-full justify-center flex-wrap mb-2">
            {imagePreview.IDFront && (
                <img
                    src={imagePreview.IDFront}
                    alt="Selected Preview"
                    style={{ width: "150px", height: "auto" }}
                />
            )}
            <input
                className="text-sm w-32 outline-none rounded-md border-none"
                type="file"
                name="IDFront"
                onChange={handleFileChange}
            />
        </div>
        <label className="text-xl self-start">ID Back</label>
        <div className="flex w-full justify-center flex-wrap mb-2">
            {imagePreview.IDBack && (
                <img
                    src={imagePreview.IDBack}
                    alt="Selected Preview"
                    style={{ width: "150px", height: "auto" }}
                />
            )}
            <input
                className="text-sm w-60 outline-none rounded-md border-none"
                type="file"
                name="IDBack"
                onChange={handleFileChange}
            />
        </div>
        <label className="text-xl self-start">
            Profession License Front
        </label>
        <div className="flex w-full justify-center flex-wrap mb-2">
            {imagePreview.ProfessionLicenseFront && (
                <img
                    src={imagePreview.ProfessionLicenseFront}
                    alt="Selected Preview"
                    style={{ width: "150px", height: "auto" }}
                />
            )}
            <input
                className="text-sm w-60 outline-none rounded-md border-none"
                type="file"
                name="ProfessionLicenseFront"
                onChange={handleFileChange}
            />
        </div>
        <label className="text-xl self-start">
            Profession License Back
        </label>
        <div className="flex w-full justify-center flex-wrap mb-10">
            {imagePreview.ProfessionLicenseBack && (
                <img
                    src={imagePreview.ProfessionLicenseBack}
                    alt="Selected Preview"
                    style={{ width: "150px", height: "auto" }}
                />
            )}
            <input
                className="text-sm w-60 outline-none rounded-md border-none"
                type="file"
                name="ProfessionLicenseBack"
                onChange={handleFileChange}
            />
        </div>
        <button
            onClick={handleButtonClick}
            className="bg-white w-32 rounded-md hover:bg-primary-light hover:text-white text-2xl mb-5"
        >
            Sign up
        </button>
    </> */