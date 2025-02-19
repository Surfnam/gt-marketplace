import React, { useState, useEffect } from "react";
import "./css/index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import ListingDetails from "./pages/ListingDetails";
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
import UserProfile from "./pages/UserProfile";
import CreateListing from "./pages/CreateListing";
import PaymentPage from './pages/PaymentPage';

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat" element={<Chat user={user} />} />
        <Route path="/profile" element={<UserProfile userProp = {user}/>} />
        <Route path="/createlisting" element={<CreateListing />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/listing/:id" element={<ListingDetails />}></Route>
      </Routes>
    </>
  );
}

root.render(
  <Router>
    <Main />
  </Router>
);
