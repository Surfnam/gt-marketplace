import React, { useState, useEffect } from "react";
import "./index.css";
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import Feedback from "./components/Feedback";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import Chat from "./Chat/Chat";
import Navbar from "./components/Navbar";
import { auth } from "./firebase"; // Import Firebase auth
import UserProfile from "./UserProfile";
import CreateListing from "./CreateListing";
import PaymentPage from './PaymentPage';

const container = document.getElementById("root");
const root = createRoot(container);

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // const mongoId = await getUserByEmail(email)[0]._id;
        // console.log(mongoId)
        const id = localStorage.getItem("userId");
        console.log('id at main', id);
      } else {
        setUser(null);
        localStorage.removeItem("userId");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Navbar
          navigateToLogin={navigateToLogin}
          navigateToRegister={navigateToRegister}
          user={user}
        />
      )}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat" element={<Chat user={user} />} />
        <Route path="/profile" element={<UserProfile userProp = {user}/>} />
        <Route path="/createlisting" element={<CreateListing />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </>
  );
}

root.render(
  <Router>
    <Main />
  </Router>
);
