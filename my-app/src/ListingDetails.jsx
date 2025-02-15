import React from "react";
import "./ListingDetails.css";
import { useParams } from "react-router-dom";

const ListingDetails = () => {
  const { id } = useParams(); // Get dynamic ID from URL

  return (
    <div className="listing-container">
        <div className="listing-image-container">
            <img className="" src="https://www.apple.com/newsroom/images/product/iphone/lifestyle/Apple_ShotoniPhone_pieter_de_vries_011221_big.jpg.large.jpg" alt="Product Image"/>
        </div>
        <div className="listing-divider"></div>
        <div className="listing-details-container">
            <div className="listing-title-container">
                <h1 id="item-title">Item Title</h1>
                <button className="listing-heart-button" onclick="toggleHeart(this)">&#10084;</button>
            </div>
            <p id="item-price"><strong>Price:</strong> $XX.XX</p>
            <p id="item-description"><strong>Description:</strong> Lorem ipsum dolor sit amet.</p>
            <p id="seller-name"><strong>Seller:</strong> John Doe</p>
            <div className="listing-message-box">
                <button className="listing-button" onclick="redirectToChat()">Message Seller</button>
            </div>
        </div>
    </div>
  );
};

export default ListingDetails;
