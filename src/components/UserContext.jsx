import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. Initial Load: Read the single "user" object from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        localStorage.removeItem("user"); // Clear corrupted data
        setUser(null);
      }
    }
  }, []);

  const login = (data) => {
    // Note: I've standardized to use 'data._id' if 'data.userId' is missing 
    // to match your server response structure in LoginPage.jsx
    const userObj = {
      _id: data.userId || data._id, // Prioritize userId from your login handler
      username: data.username,
      email: data.email,
      token: data.token,
    };

    // 2. Login: Save the complete user object to the single key "user"
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  // 3. Logout: Clear the complete user object from the single key "user"
  const logout = () => {
    // FIX: Remove the key that the login function uses to persist the session.
    localStorage.removeItem("user"); 
    // You can keep this if you manage the admin session separately
    localStorage.removeItem("adminToken"); 
    
    // Clear the React state
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);