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
import { Predict } from "./pages/Patient/Predict";
import { Prescriptions } from "./pages/Patient/Prescriptions";
import { PurchaseVIP } from "./pages/Patient/PurchaseVIP";

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
            console.log(response.data.data);
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
                        <Route path="/predict" element={<Predict user={user} />} />
                        <Route path="/myprescriptions" element={<Prescriptions user={user} />} />
                        <Route path="/purchasevip" element={<PurchaseVIP user={user} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {/* Routes for non-logged-in users */}
            {!isLoggedIn && (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
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
