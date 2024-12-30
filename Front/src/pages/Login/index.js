import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppContext,
  useAuthContext,
  useUserContext,
} from "../../provider/index";

import logo from "../../assets/images/TitleImage.png";

//Styles
// import "./style.scss";

const Login = () => {
  const { createNotification, setIsLoading } = useAppContext();
  const [data, setData] = useState({ mail: "", password: "" });

  const navigate = useNavigate();

  const handdleSignUpButtonClick = () => {
    // Run your additional logic here, if needed
    navigate("/signup"); // Manually navigate to the signup page
  };

  const handdleButtonClick = async (e) => {
    e.preventDefault();

    if (!data.mail || !data.password) {
      createNotification("Please Enter valid mail and Password", "warning");
      return;
    }
    try {

      const res = await axios.post("http://localhost:8080/auth/login", data);
      if (res.status === 200 || res.statusCode === 200) {
        console.log(res);
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userId", res.data.data.user.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        console.log("Navigating to /");
        navigate(0);
      } if (res.status === 401 || res.statusCode === 401) {
        createNotification("Wrong mail or Password", "error");
        return;
      }
    }
    catch (error) {
      createNotification(error.response.data.msg, "error");
    }


  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto center">
      < Link to="/" className="flex justify-center" >
        <img src={logo} alt="Live=Healthy Logo" className="w-48"></img>
      </Link >
      <div>
        <div className="flex flex-col mb-2">
          <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
          <input
            className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            type="text"
            placeholder="Email"
            value={data.mail}
            onChange={(e) => setData({ ...data, mail: e.target.value })}
          />
        </div>
        <div className="flex flex-col mb-2">
          <label className="block text-lg font-medium text-gray-700 mb-2">Password</label>
          <input
            className="outline-none w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end w-full">
        <Link to="/forget-password">
          <label className="text-lg text-blue-600 cursor-pointer hover:underline">
            Forgot your password?
          </label>

        </Link>
      </div>
      <div className="my-3 flex justify-evenly w-full">
        <button
          onClick={handdleButtonClick}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Login
        </button>
        <Link to="/signup">
          <button
            onClick={handdleSignUpButtonClick}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            sign up
          </button>
        </Link>
      </div>
    </div >
  );
};

export default Login;
