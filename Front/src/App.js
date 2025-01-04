import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { useAuthContext, useUserContext, useAppContext } from "./provider";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from './assets/images/Logo.png';

// Styles
import "react-notifications/lib/notifications.css";
import Patient from "./pages/Patient";
import Balance from "./pages/Patient/Balance";
import { Chat } from "./pages/Patient/Chat";
import { Appointment } from "./pages/Patient/Appointment";
import { PurchaseVIP } from "./pages/Patient/PurchaseVIP";
import Admin from "./pages/Admin";
import AddCenter from "./pages/Admin/AddCenter";
import Centers from "./pages/Admin/Centers";
import Doctors from "./pages/Admin/Doctors";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ForgetPassword/RestPassword";
import Doctor from "./pages/Doctor";
import AssignAppointment from "./pages/Doctor/AssignAppointment";
import MyAppointments from "./pages/Doctor/MyAppointments";
import DChat from "./pages/Doctor/chat";
import AssignChat from "./pages/Doctor/patients";
import AllChats from "./pages/Doctor/AllChats";


const queryClient = new QueryClient();

function App() {
  const { isLoggedIn } = useAuthContext();
  const { userType } = useUserContext();
  const { createNotification, isLoading, setIsLoading } = useAppContext();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);  // For error state
  const [isAuthenticating, setIsAuthenticating] = useState(true); // New state for tracking auth check

  useEffect(() => {
    const getUser = async () => {
      if (userType.uId !== null) {
        setIsLoading(true);
        setIsAuthenticating(true); // Start the authentication check
        try {
          const response = await axios.get(`http://localhost:8080/user/${userType.uId}`);
          if (response.status === 200) {
            setUser(response.data.data);
          }
        } catch (error) {
          createNotification("Cannot retrieve User", "error");
          setError("Failed to fetch user data.");
        } finally {
          setIsLoading(false);
          setIsAuthenticating(false); // End the authentication check
        }
      } else {
        setIsAuthenticating(false); // No user ID, authentication is done
      }
    };

    if (userType.uId) {
      getUser();
    } else {
      setIsAuthenticating(false); // No user ID, authentication is done
    }
  }, [userType.uId]);

  // Handle rendering during loading or error states
  if (isAuthenticating || isLoading) {
    return (
      <div className="center">
        <img src={logo} alt="Logo" className="animate-spinSlow" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="app-container">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Routes for Logged-in users */}
            {user && (
              <>
                {isLoggedIn && (
                  <>
                    {user.accountType === "patient" && (
                      <>
                        <Route path="/" element={<Patient user={user} />} />
                        <Route path="/mycoins" element={<Balance user={user} />} />
                        <Route path="/chat" element={<Chat user={user} />} />
                        <Route path="/appointment" element={<Appointment user={user} />} />
                        <Route path="/purchasevip" element={<PurchaseVIP user={user} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </>
                    )}
                    {user.accountType === "admin" && (
                      <>
                        <Route path="/" element={<Admin user={user} />} />
                        <Route path="/add-center" element={<AddCenter user={user} />} />
                        <Route path="/centers" element={<Centers user={user} />} />
                        <Route path="/doctors" element={<Doctors user={user} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </>
                    )}
                    {user.accountType === 'specialist' || user.accountType === 'consultant' ?
                      <>
                        <Route path="/" element={<Doctor user={user} />} />
                        <Route path="/appointments" element={<AssignAppointment user={user} />} />
                        <Route path="/myappointments" element={<MyAppointments user={user} />} />
                        <Route path="/chats" element={<AllChats user={user} />} />
                        <Route path="/:id" element={<DChat user={user} />} />
                        <Route path="/patients" element={<AssignChat user={user} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </>
                      : null
                    }
                  </>
                )}
              </>
            )}

            {/* Routes for non-logged-in users */}
            {!isLoggedIn && (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;