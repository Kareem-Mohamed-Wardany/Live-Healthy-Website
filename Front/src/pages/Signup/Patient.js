import React from 'react'
import { useState } from 'react';

import "react-datepicker/dist/react-datepicker.css";

const Patient = (props) => {
    //   Patient Data
    const [bloodType, setBloodType] = useState("");
    const [isSmoker, setIsSmoker] = useState(false);
    const [hasHeartDiseases, setHasHeartDiseases] = useState(false);
    const [hasDiabetes, setHasDiabetes] = useState(false);
    const [hasCancer, sethasCancer] = useState(false);
    const [hasObesity, setHasObesity] = useState(false);
    const [hasHypertension, setHasHypertension] = useState(false);
    const [hasAllergies, setHasAllergies] = useState(false);
    const valid = () => {
        if (!bloodType) {
            props.createNotification("Blood Type is required", "error");
            return false;
        }
        return true
    }
    const handleButtonClick = async (e) => {
        e.preventDefault();
        if (!props.validate() || !valid())
            return
        let res;
        if (props.accountType === "patient") {
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
                    address: props.address,
                    healthStatus: {
                        bloodType: bloodType,
                        smoker: isSmoker,
                        HeartDiseases: hasHeartDiseases,
                        Diabetes: hasDiabetes,
                        Cancer: hasCancer,
                        Obesity: hasObesity,
                        Hypertension: hasHypertension,
                        Allergies: hasAllergies,
                    },
                }),
            })
        }
        res = await res.json()
        console.log(res)
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
        <>
            <label className="text-3xl font-semibold mb-6 text-gray-800 text-center">General Information</label>
            <select
                className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
                name="bloodType"
                onChange={(e) => {
                    setBloodType(e.target.value);
                }}
            >
                <option value="invalid" disabled selected>
                    Blood Type
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
            </select>
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isSmoker}
                        onChange={(e) => setIsSmoker(e.target.checked)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-lg">Smoker</label>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hasHeartDiseases}
                        onChange={(e) => setHasHeartDiseases(e.target.checked)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-lg">Heart Diseases</label>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hasDiabetes}
                        onChange={(e) => setHasDiabetes(e.target.checked)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-lg">Diabetes</label>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hasCancer}
                        onChange={(e) => sethasCancer(e.target.checked)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-lg">Cancer</label>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hasObesity}
                        onChange={(e) => setHasObesity(e.target.checked)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-lg">Obesity</label>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hasHypertension}
                        onChange={(e) => setHasHypertension(e.target.checked)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-lg">Hypertension</label>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hasAllergies}
                        onChange={(e) => setHasAllergies(e.target.checked)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-lg">Allergies</label>
                </div>
            </div>

            <button
                onClick={handleButtonClick}
                className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                Sign up
            </button>
        </>
    )
}
export default Patient
