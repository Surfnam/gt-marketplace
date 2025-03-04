import React, { useState, useEffect } from "react";
import "../css/ListingDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const getListing = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/listing/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching listing:", error);
        return null;
    }
};

const getSeller = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/api/users/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching listing:", error);
        return null;
    }
};

const addContact = async (user1Id, user2Id) => {
    try {
        await axios.post("http://localhost:3001/api/users/addContact", {
            user1Id: user1Id,
            user2Id: user2Id,
        });
    } catch (error) {
        console.error("Error adding contact:", error);
    }
}

const ListingDetails = () => {
  const { id } = useParams(); // Get dynamic ID from URL
  const [listingDetails, setListingDetails] = useState(null);
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchData = async () => {
        const data = await getListing(id);
        setListingDetails(data);
        const sellerData = await getSeller(data.seller);
        setSeller(sellerData);
    };

    fetchData();
  }, [id, listingDetails]);
  console.log('seller: ' + seller);
  // Display nothing until listingDetails is populated and we get back the name of the seller
  if (!listingDetails || !seller) {
    return <div></div>;
  }

  const handleSendMessageClick = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Please log in to message the seller.");
        return;
    }
    
    await addContact(userId, seller._id);
    navigate(`/chat?newcontactemail=${seller.email}`);
  }

  return (
    <div className="listing-container">
        <div className="listing-image-container">
            <img className="" src={listingDetails.image} alt="Product Image"/>
        </div>
        <div className="listing-details-container">
            <div className="listing-title-container">
                <h1 id="item-title">{listingDetails.title}</h1>
                <button className="listing-heart-button" onClick="toggleHeart(this)">&#10084;</button>
            </div>
            <p id="item-price"><strong>Price: </strong> ${listingDetails.price}</p>
            <p id="item-description"><strong>Description: </strong>{listingDetails.description}</p>
            <p id="item-condition"><strong>Condition: </strong>{listingDetails.condition}</p>
            <p id="seller-name"><strong>Seller: </strong>{seller.fullName}</p>
            <div className="listing-message-box">
                <button className="listing-button" onClick={handleSendMessageClick}>Message Seller</button>
            </div>
        </div>
    </div>
  );
};

export default ListingDetails;
