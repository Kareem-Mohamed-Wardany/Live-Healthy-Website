# **Live Healthy Website**

This repository hosts a web application built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js) with **TailwindCSS** for the frontend design. The platform facilitates real-time communication and appointment scheduling between patients and verified doctors.

---

## **Features**

### **For Patients**
- **Login and Sign-Up**  
  - Secure authentication to access the system.  

- **Real-Time Chat with Doctors**  
  - Chat powered by **Socket.IO** for seamless, instant messaging.  
  - Only verified doctors are available for communication.  

- **Appointment Booking**  
  - Patients can request appointments, and doctors can accept or decline them.  
  - Track appointment status in real-time.  

- **Email Notifications**  
  - Receive email updates for every step in the process (e.g., appointment requests, approvals, or chat invitations) via **NodeMailer**.

---

### **For Doctors**
- **Verified Access**  
  - Only system-admin-approved doctors can access the platform.  

- **Manage Appointments**  
  - Accept or decline patient appointment requests.  

- **Real-Time Chat**  
  - Communicate with patients efficiently using the real-time chat feature.

---

### **For Admins**
- **Verification System**  
  - Review and approve doctor profiles before granting them access.  
  - Ensure only certified professionals interact with patients.

---

## **Tech Stack**

### **Frontend**
- **React.js**  
- **TailwindCSS** for responsive, modern, and clean UI design.  

### **Backend**
- **Node.js** and **Express.js** for handling server logic.  
- **MongoDB** as the database.  

### **Real-Time Communication**
- **Socket.IO** for implementing live chat functionality.  

### **Email Notifications**
- **NodeMailer** for sending email updates.

---

## **Installation**

### **Step 1: Clone the Repository**

Step 2: Install Dependencies
Install both front and back dependencies

Step 3: Set Environment Variables

Create a .env file in the server folder and configure the following variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

Step 4: Start the Application

Run both the client and server:

---

Usage Guide

Patients

1. Sign Up or Log In to the platform.


2. Use the real-time chat feature to communicate with verified doctors.


3. Book an appointment and wait for doctor approval.


4. Receive email notifications for every process step.



Doctors

1. Log in to your account (after admin verification).


2. Manage patient appointment requests (accept or decline).


3. Engage in real-time chat with patients.




---

Key Features in Detail

Real-Time Chat

Powered by Socket.IO, this feature allows instant communication between patient and doctor.

Ensures smooth, lag-free conversations.


Email Notifications

Handled by NodeMailer, the system sends emails to keep patients informed about:

Chat requests.

Appointment status changes.



Admin Verification

Admins ensure only verified doctors can access the system.

This guarantees the credibility of medical professionals on the platform.



---

Future Enhancements

Add video consultation for virtual doctor visits.

Include patient history tracking for better healthcare insights.



---

Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.


2. Create a new branch for your feature or bugfix.


3. Submit a pull request with detailed changes.




---

License

This project is licensed under the MIT License. See the LICENSE file for more information.


---

Acknowledgments

Special thanks to:

The MERN stack community for invaluable resources.

Developers contributing to open-source libraries like Socket.IO and NodeMailer.




