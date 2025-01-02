import React from "react";

const AppointmentCard = (props) => {
    const {
        name,
        gender,
        dateOfBirth,
        phone,
        mail,
        healthStatus,
    } = props.patientId;

    return (
        <div className="mx-auto bg-white shadow-lg rounded-lg border border-gray-200 p-4 space-y-2 ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">Appointment Details</h2>

            {/* Appointment Details */}
            <div>
                <p className="text-gray-700">
                    <span className="font-semibold">Date:</span> {props.appointmentDate}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Time:</span> {props.appointmentTime}
                </p>
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
                    {new Date(dateOfBirth).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span> {phone}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Email:</span> {mail}
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

            {/* Accept Button */}
            {
                !props.cancel && <div className="flex justify-center">
                    <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => { props.handlebtn(props._id) }}>
                        Accept
                    </button>
                </div>
            }
            {
                props.cancel && <div className="flex justify-center">
                    <button className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={() => { props.handlebtn(props._id) }}>
                        Cancel
                    </button>
                </div>
            }

        </div>

    );
};

export default AppointmentCard;
