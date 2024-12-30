import { createContext, useContext, useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";


const AppContext = createContext(null);
const AuthContext = createContext(null);
const UserContext = createContext(null);

export const useAppContext = () => useContext(AppContext);
export const useAuthContext = () => useContext(AuthContext);
export const useUserContext = () => useContext(UserContext);

const typeUser = () => {
  const userId = localStorage.getItem("userId");
  return { uId: userId };
};
const token = localStorage.getItem("token");
const expiryDate = localStorage.getItem("expiryDate");

const checkExpire = () => {
  if (!expiryDate) return false; // Handle case where expiryDate might be missing
  return new Date(expiryDate) > new Date(); // Return true if not expired
};
export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState({ uId: null });
  const [isLoading, setIsLoading] = useState(false);

  const createNotification = (message = "", type = "error") => {
    // eslint-disable-next-line default-case
    switch (type) {
      case "info":
        NotificationManager.info(message);
        break;
      case "success":
        NotificationManager.success(message);
        break;
      case "warning":
        NotificationManager.warning(message);
        break;
      case "error":
        NotificationManager.error(message);
        break;
    }
  };

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
    } else {
      if (checkExpire()) {
        setIsLoggedIn(true);
        setUserType(typeUser());
      }
      // If token is expired, remove it from local storage and set isLoggedIn to false
      else {
        setUserType({ uId: null });
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate");
        setIsLoggedIn(false);
        window.location.reload();
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log(isLoading);
    }
  }, [isLoggedIn]);

  return (
    <AppContext.Provider
      value={{ createNotification, isLoading, setIsLoading }}
    >
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <UserContext.Provider value={{ userType, setUserType }}>
          <NotificationContainer />
          {children}
        </UserContext.Provider>
      </AuthContext.Provider>
    </AppContext.Provider>
  );
};
