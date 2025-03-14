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

//Marks listing as inactive, changes listing condition, removes it from listings array for seller, puts it in inactiveListings array for seller
const markAsInactive = async (listingId, sellerId, currentStatus) => {
    try {
        if (currentStatus === "available") {
            await axios.patch(`http://localhost:3001/listing/${listingId}`, {
                status: "unavailable",
            });
            await axios.post("http://localhost:3001/api/users/inactiveListings", {
                sellerId,
                listingId,
            });
            await axios.delete("http://localhost:3001/api/users/activeListings", {
                data: {
                    sellerId,
                    listingId,
                }
            });
        } else if (currentStatus === "unavailable") {
            await axios.patch(`http://localhost:3001/listing/${listingId}`, {
                status: "available",
            });
            await axios.post("http://localhost:3001/api/users/activeListings", {
                sellerId,
                listingId,
            });
            await axios.delete("http://localhost:3001/api/users/inactiveListings", {
                data: {
                    sellerId,
                    listingId,
                }
            });
        }
    } catch (error) {
        console.error("Error marking listing as inactive:", error)
    }
}

const ListingDetails = () => {
  const { id } = useParams(); // Get dynamic ID from URL
  const [listingDetails, setListingDetails] = useState(null);
  const [seller, setSeller] = useState(null);
  const [listingStatus, setListingStatus] = useState("");
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchData = async () => {
        const data = await getListing(id);
        setListingDetails(data);
        const sellerData = await getSeller(data.seller);
        setSeller(sellerData);
        setListingStatus(data.status);
    };

    fetchData();
  }, [id]);
  console.log('seller: ' + seller);
  // Display nothing until listingDetails is populated and we get back the name of the seller
  if (!listingDetails || !seller) {
    return <div>Loading...</div>;
  }

  const userId = localStorage.getItem("userId");
  const isSeller = userId === seller._id;

  const handleSendMessageClick = async () => {
    if (!userId) {
        alert("Please log in to message the seller.");
        return;
    }
    
    await addContact(userId, seller._id);
    navigate(`/chat?newcontactemail=${seller.email}`);
  }

  const handleMarkAsInactive = async () => {
    await markAsInactive(listingDetails._id, seller._id, listingStatus);
    setListingStatus(prevStatus => prevStatus === "available" ? "unavailable" : "available");
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
            <p id="item-description">
            <strong>Description: </strong>
            {listingDetails.description.split("\n").map((line, index) => (
                <span key={index}>
                {line}
                <br />
                </span>
            ))}
            </p>
            <p id="item-condition"><strong>Condition: </strong>{listingDetails.condition}</p>
            <p id="seller-name"><strong>Seller: </strong>{seller.fullName}</p>
            <div className="listing-message-box">
                {isSeller ? (<button className="listing-button" onClick={handleMarkAsInactive}>{listingStatus === "available" ? "Mark as Inactive" : "Mark as Active"}</button>) : (<button className="listing-button" onClick={handleSendMessageClick}>Message Seller</button>)}
            </div>
        </div>
    </div>
  );
};

export default ListingDetails;
