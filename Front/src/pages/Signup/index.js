import React, { useState, useEffect } from "react";
import logo from "../../assets/images/TitleImage.png";
import CircleProg from "../../components/Progress/CircleProg";
import DatePicker from "react-datepicker";
import { useNavigate, Link } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

import { useAppContext } from "../../provider/index";

import Patient from "./Patient";
import Doctor from "./Doctor";
import Radiologist from "./Radiologist";

// import "./style.scss";
import axios from "axios";
const SignUp = () => {
  const navigate = useNavigate();
  const { createNotification } = useAppContext();
  const [Phase, setPhase] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [gender, setGender] = useState("");
  const [accountType, setAccountType] = useState("");

  const validate = () => {
    // First Name Validation
    if (!firstName) {
      createNotification("First Name is required", "error");
      return false;
    }

    // Last Name Validation
    if (!lastName) {
      createNotification("Last Name is required", "error");
      return false;
    }

    // Email Validation
    if (!email) {
      createNotification("E-mail is required", "error");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      createNotification("Email address is invalid", "error");
      return false;
    }

    // Password Validation
    if (!password) {
      createNotification("Password is required", "error");
      return false;
    } else if (password.length < 6) {
      createNotification("Password must be at least 6 characters", "error");
      return false;
    }

    // Phone Number Validation
    if (!phoneNumber) {
      createNotification("Phone number is required", "error");
      return false;
    } else if (!/^\d{11}$/.test(phoneNumber)) {
      createNotification("Phone number must be 11 digits", "error");
      return false;
    }
    if (!startDate) {
      createNotification("Date of Birth is required", "error");
      return false;
    }
    if (!accountType) {
      createNotification("User Type is required", "error");
      return false;
    }
    if (!gender) {
      createNotification("Gender is required", "error");
      return false;
    }
    return true;
  };


  return (
    <>
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <Link to="/" className="flex justify-center">
          <img src={logo} alt="Live=Healthy Logo" className="w-40"></img>
        </Link>
        <label className="block text-3xl font-medium text-gray-700 mb-2 text-center">Welcome to Live Heathy </label>
        <div className="flex gap-5 flex-col">
          <div className="flex flex-col ">
            <input
              className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
              type="text"
              placeholder="First Name"
              value={firstName} // Bind state value to the input field
              onChange={(e) => setFirstName(e.target.value)} // Update state on change
            />

            <input
              className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <div className="inputField">
              <DatePicker
                placeholderText="Date of Birth"
                className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-2"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>

            <select
              className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700  mb-2"
              name="Gender"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="invalid" disabled selected>
                Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mx-1"
              name="userType"
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="invalid" disabled selected>
                User Type
              </option>
              <option value="patient">Patient</option>
              <option value="specialist">Specialist</option>
              <option value="consultant">Consultant</option>
              <option value="radiologist">Radiologist</option>
            </select>

          </div>
          <div className="flex flex-col">
            {accountType === "patient" && (
              <>
                <Patient
                  validate={validate}
                  accountType={accountType}
                  email={email}
                  password={password}
                  firstName={firstName}
                  lastName={lastName}
                  phoneNumber={phoneNumber}
                  startDate={startDate}
                  gender={gender}
                  createNotification={createNotification}
                  navigate={navigate}
                />
              </>
            )}
            {accountType === "specialist" && (
              <>
                <Doctor
                  validate={validate}
                  accountType={accountType}
                  email={email}
                  password={password}
                  firstName={firstName}
                  lastName={lastName}
                  phoneNumber={phoneNumber}
                  startDate={startDate}
                  gender={gender}
                  createNotification={createNotification}
                  navigate={navigate}
                />
              </>

            )}
            {accountType === "consultant" && (
              <>
                <Doctor
                  validate={validate}
                  accountType={accountType}
                  email={email}
                  password={password}
                  firstName={firstName}
                  lastName={lastName}
                  phoneNumber={phoneNumber}
                  startDate={startDate}
                  gender={gender}
                  createNotification={createNotification}
                  navigate={navigate}
                />
              </>
            )}
            {accountType === "radiologist" && (
              <>
                <Radiologist
                  validate={validate}
                  accountType={accountType}
                  email={email}
                  password={password}
                  firstName={firstName}
                  lastName={lastName}
                  phoneNumber={phoneNumber}
                  startDate={startDate}
                  gender={gender}
                  createNotification={createNotification}
                  navigate={navigate}
                />
              </>
            )}</div>
        </div>
      </div >
    </>
  );
};

export default SignUp;
