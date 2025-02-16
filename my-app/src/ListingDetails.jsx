import React, { useState, useEffect } from "react";
import "./ListingDetails.css";
import { useParams } from "react-router-dom";

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


const ListingDetails = () => {
  const { id } = useParams(); // Get dynamic ID from URL
  const [listingDetails, setListingDetails] = useState(null);
  const [sellerName, setSellerName] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
        const data = await getListing(id);
        setListingDetails(data);
        const sellerData = await getSeller(data.seller);
        setSellerName(sellerData);
    };

    fetchData();
}, [id, listingDetails]);

  // Display nothing until listingDetails is populated and we get back the name of the seller
  if (!listingDetails || !sellerName) {
    return <div></div>;
  }

  return (
    <div className="listing-container">
        <div className="listing-image-container">
            <img className="" src={listingDetails.image} alt="Product Image"/>
        </div>
        <div className="listing-divider"></div>
        <div className="listing-details-container">
            <div className="listing-title-container">
                <h1 id="item-title">{listingDetails.title}</h1>
                <button className="listing-heart-button" onclick="toggleHeart(this)">&#10084;</button>
            </div>
            <p id="item-price"><strong>Price: </strong> ${listingDetails.price}</p>
            <p id="item-description"><strong>Description: </strong>{listingDetails.description}</p>
            <p id="item-condition"><strong>Condition: </strong>{listingDetails.condition}</p>
            <p id="seller-name"><strong>Seller: </strong>{sellerName.fullName}</p>
            <div className="listing-message-box">
                <button className="listing-button" onclick="redirectToChat()">Message Seller</button>
            </div>
        </div>
    </div>
  );
};

export default ListingDetails;
