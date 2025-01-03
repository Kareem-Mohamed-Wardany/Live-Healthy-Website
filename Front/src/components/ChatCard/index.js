import React from "react";
import formatDate from "../../util/formateData";

const ChatCard = (props) => {
    const {
        name,
        gender,
        dateOfBirth,
        phone,
        mail,
        address,
        healthStatus,
    } = props.patientId;

    return (
        <div className="mx-auto bg-white shadow-lg rounded-lg border border-gray-200 p-4 space-y-2 ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">Chat Details</h2>

            {/* Appointment Details */}
            <div>
                <p className="text-gray-700">
                    <span className="font-semibold">Reason:</span> {props.reason}
                </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">Patient Details</h2>
            {/* Patient Details */}
            <div>
                <p className="text-gray-700">
                    <span className="font-semibold">Name:</span> {name}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Gender:</span> {gender}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Date of Birth:</span>{" "}
                    {formatDate(new Date(dateOfBirth))}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span> {phone}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Email:</span> {mail}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Address:</span> {address}
                </p>
            </div>

            {/* Health Status */}
            <h2 className="text-2xl font-semibold text-gray-80">Health Status</h2>
            <div className="text-gray-700">
                <p>
                    <span className="font-semibold">Blood Type:</span> {healthStatus.bloodType}
                </p>
                <p>
                    <span className="font-semibold">Smoker:</span> {healthStatus.smoker ? "Yes" : "No"}
                </p>
                <p>
                    <span className="font-semibold">Heart Diseases:</span> {healthStatus.HeartDiseases ? "Yes" : "No"}
                </p>
                <p>
                    <span className="font-semibold">Diabetes:</span> {healthStatus.Diabetes ? "Yes" : "No"}
                </p>
                <p>
                    <span className="font-semibold">Cancer:</span> {healthStatus.Cancer ? "Yes" : "No"}
                </p>
                <p>
                    <span className="font-semibold">Obesity:</span> {healthStatus.Obesity ? "Yes" : "No"}
                </p>
            </div>
            {!props.chat && <div className="flex justify-center">
                <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => { props.handlebtn(props._id) }}>
                    Accept
                </button>
            </div>}
            {props.chat &&
                <div className="flex justify-center">
                    <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500" onClick={() => { props.handlebtn(props._id) }}>
                        Chat
                    </button>
                </div>
            }



        </div>

    );
};

export default ChatCard;
