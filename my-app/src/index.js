import React, { useState, useEffect } from "react";
import "./index.css";
import Home from "./Home/Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import AboutUs from "./AboutUs/AboutUs";
import Contact from "./Contact/Contact";
import ListingDetails from "./Listings/ViewListing";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import Chat from "./Chat/ChatInterface/Chat";
import Navbar from "./Navbar/Navbar";
import { auth } from "./firebase"; // Import Firebase auth
import UserProfile from "./UserProfile/UserProfile";
import CreateListing from "./Listings/CreateListing";
import PaymentPage from './PaymentPage/PaymentPage';
import EditListing from "./Listings/EditListing";
import Unauthorized from "./pages/Unauthorized";
import ForgotPassword from "./pages/ForgotPassword";

const container = document.getElementById("root");
const root = createRoot(container);

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user exists")
        setUser(user);
        // const mongoId = await getUserByEmail(email)[0]._id;
        // console.log(mongoId)
        const id = localStorage.getItem("userId");
        console.log('id at main', id);
      } else {
        console.log("onAuthchanged unsubscribe")
        setUser(null);
        localStorage.removeItem("userId");
        navigateToLogin()
      } 
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return <div>Loading...</div>
  }

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat" element={<Chat user={user} />} />
        <Route path="/profile" element={<UserProfile userProp = {user}/>} />
        <Route path="/createlisting" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<EditListing userProp={user}/>} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/listing/:id" element={<ListingDetails />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

root.render(
  <Router>
    <Main />
  </Router>
);
