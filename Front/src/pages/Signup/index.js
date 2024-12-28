import React, { useState, useEffect } from "react";
import logo from "../../assets/images/TitleImage.png";
import CircleProg from "../../components/Progress/CircleProg";
import DatePicker from "react-datepicker";
import { useNavigate, Link } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

import { useAppContext } from "../../provider/index";

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
  const [gender, setGender] = useState("male");
  const [accountType, setAccountType] = useState("patient");

  //   Patient Data
  const [bloodType, setBloodType] = useState("A+");
  const [isSmoker, setIsSmoker] = useState(false);
  const [hasHeartDiseases, setHasHeartDiseases] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasCancer, sethasCancer] = useState(false);
  const [hasObesity, setHasObesity] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [hasAllergies, setHasAllergies] = useState(false);

  //   specialist or consultant Data
  const [university, setUniversity] = useState("");
  const [imagePreview, setImagePreview] = useState({});
  const [files, setFiles] = useState({});

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
          setRadioCenters(res.data.radiologyCenters);
          console.log(radioCenters);
        }
      } catch (error) {
        createNotification("Error fetching radiology centers", "error");
        console.error("Error fetching radiology centers:", error);
      }
    };

    fetchData();
  }, [accountType]);

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

    if (accountType === "invalid") {
      createNotification("User Type is required", "error");
      return false;
    }
    if (gender === "invalid") {
      createNotification("Gender is required", "error");
      return false;
    }

    // Return error object
    return true;
  };

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

  const handleButtonClick = async (e) => {
    e.preventDefault();
    if (Phase === 1 && validate()) {
      setPhase(2);
    }
    if (Phase === 2) {
      let res;
      if (accountType === "patient")
        res = await axios.post("http://localhost:8080/auth/signup", {
          mail: email,
          password: password,
          name: firstName + " " + lastName,
          accountType: accountType,
          phone: phoneNumber,
          birth: startDate.toISOString(),
          gender: gender,
          bloodType: bloodType,
          smoker: isSmoker,
          HeartDiseases: hasHeartDiseases,
          Diabetes: hasDiabetes,
          Cancer: hasCancer,
          Obesity: hasObesity,
          Hypertension: hasHypertension,
          Allergies: hasAllergies,
        });
      if (accountType === "specialist" || accountType === "consultant") {
        const formData = new FormData();
        formData.append("mail", email);
        formData.append("password", password);
        formData.append("name", `${firstName} ${lastName}`);
        formData.append("accountType", accountType);
        formData.append("phone", phoneNumber);
        formData.append("birth", startDate.toISOString());
        formData.append("gender", gender);
        formData.append("university", university);
        formData.append("IDFront", files.IDFront);
        formData.append("IDBack", files.IDBack);
        formData.append("ProfessionLicenseFront", files.ProfessionLicenseFront);
        formData.append("ProfessionLicenseBack", files.ProfessionLicenseBack);
        res = await axios.post("http://localhost:8080/auth/signup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res.data);
      }
      // res = await axios.post("http://localhost:8080/auth/signup", {
      //   mail: email,
      //   password: password,
      //   name: firstName + " " + lastName,
      //   accountType: accountType,
      //   phone: phoneNumber,
      //   birth: startDate.toISOString(),
      //   gender: gender,
      //   university: university,
      //   IDFront: imagePreview.IDFront,
      //   IDBack: imagePreview.IDBack,
      //   ProfFront: imagePreview.ProfessionLicenseFront,
      //   ProfBack: imagePreview.ProfessionLicenseBack,
      // });
      if (accountType === "radiologist")
        res = await axios.post("http://localhost:8080/auth/signup", {
          mail: email,
          password: password,
          name: firstName + " " + lastName,
          accountType: accountType,
          phone: phoneNumber,
          birth: startDate.toISOString(),
          gender: gender,
          centerName: center,
          code: code,
        });
      if (res.status === 201) {
        createNotification("Account Created Successfully", "success");
        navigate("/");
      } else {
        createNotification(
          "Failed to create account. Please try again",
          "error"
        );
      }
    }
    // Add your validation and submission logic here
  };

  return (
    <>
      <div className="center flex flex-col items-center">
        <Link to="/">
          <img src={logo} alt="Live=Healthy Logo" className="w-52"></img>
        </Link>
        <label className="text-3xl mb-3">Welcome to Live Heathy </label>
        {Phase === 1 && (
          <>
            <input
              className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2"
              type="text"
              placeholder="First Name"
              value={firstName} // Bind state value to the input field
              onChange={(e) => setFirstName(e.target.value)} // Update state on change
            />

            <input
              className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2"
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <div className="inputField">
              <DatePicker
                placeholderText="Date of Birth"
                className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className="mb-5">
              <select
                className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2 mx-1"
                name="Gender"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="invalid" disabled selected>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2 mx-1"
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
            <button
              onClick={handleButtonClick}
              className="bg-white w-32 rounded-md hover:bg-primary-light hover:text-white text-2xl mb-5"
            >
              Next
            </button>
          </>
        )}
        {Phase === 2 && (
          <>
            <label className="text-2xl mb-6">General Information</label>
            {accountType === "patient" && (
              <>
                <select
                  className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-2 mx-1"
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
                <div className="flex w-60 flex-wrap content-between gap-1 mb-5">
                  <label className="p-1 m-1">
                    <input
                      type="checkbox"
                      checked={isSmoker} // Control the checkbox's checked state
                      onChange={(e) => {
                        setIsSmoker(e.target.checked);
                      }}
                    />
                    Smoker
                  </label>
                  <label className="p-1 m-1">
                    <input
                      type="checkbox"
                      checked={hasHeartDiseases} // Control the checkbox's checked state
                      onChange={(e) => {
                        setHasHeartDiseases(e.target.checked);
                      }}
                    />
                    Heart Diseases
                  </label>
                  <label className="p-1 ml-1">
                    <input
                      type="checkbox"
                      checked={hasDiabetes} // Control the checkbox's checked state
                      onChange={(e) => {
                        setHasDiabetes(e.target.checked);
                      }}
                    />
                    Diabetes
                  </label>
                  <label className="p-1 mr-1">
                    <input
                      type="checkbox"
                      checked={hasCancer}
                      // Control the checkbox's checked state
                      onChange={(e) => {
                        sethasCancer(e.target.checked);
                      }}
                    />
                    Cancer
                  </label>
                  <label className="p-1 m-1">
                    <input
                      type="checkbox"
                      checked={hasObesity} // Control the checkbox's checked state
                      onChange={(e) => {
                        setHasObesity(e.target.checked);
                      }}
                    />
                    Obesity
                  </label>
                  <label className="p-1 m-1">
                    <input
                      type="checkbox"
                      checked={hasHypertension} // Control the checkbox's checked state
                      onChange={(e) => {
                        setHasHypertension(e.target.checked);
                      }}
                    />
                    Hypertension
                  </label>
                  <label className="p-1 m-1">
                    <input
                      type="checkbox"
                      checked={hasAllergies} // Control the checkbox's checked state
                      onChange={(e) => {
                        setHasAllergies(e.target.checked);
                      }}
                    />
                    Allergies
                  </label>
                </div>
              </>
            )}
            {accountType === "specialist" || accountType === "consultant" ? (
              <>
                <input
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
                    className="text-sm w-60 outline-none rounded-md border-none"
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
              </>
            ) : null}
            {accountType === "radiologist" && (
              <>
                <select
                  className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-5 mx-1"
                  name="radiologyCenter"
                  onChange={(e) => {
                    setCenter(e.target.value);
                  }}
                >
                  <option value="invalid" disabled selected>
                    Radiology Center
                  </option>
                  {radioCenters.map((c) => (
                    <option value={c.name} key={c._id.toString()}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  className="outline-none rounded-md p-1 shadow-custom gap-1 text-2xl pl-2 mb-10"
                  type="text"
                  placeholder="Verification Code"
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                />
              </>
            )}
            <button
              onClick={handleButtonClick}
              className="bg-white w-32 rounded-md hover:bg-primary-light hover:text-white text-2xl mb-5"
            >
              Sign up
            </button>
          </>
        )}
        <CircleProg phase={Phase} />
      </div>
    </>
  );
};

export default SignUp;
