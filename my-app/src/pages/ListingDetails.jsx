import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";

const ListingDetails = () => {
  const { id } = useParams();
  const [listingDetails, setListingDetails] = useState(null);
  const [seller, setSeller] = useState(null);
  const [listingStatus, setListingStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getListing = async () => {
      try {
        const response = await fetch(`http://localhost:3001/listing/${id}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching listing:", error);
        return null;
      }
    };

    const getSeller = async (sellerId) => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${sellerId}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching seller:", error);
        return null;
      }
    };

    const fetchData = async () => {
      const data = await getListing();
      if (!data) return;
      setListingDetails(data);
      const sellerData = await getSeller(data.seller);
      setSeller(sellerData);
      setListingStatus(data.status);
    };
    fetchData();
  }, [id]);

  if (!listingDetails || !seller) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const userId = localStorage.getItem("userId");
  const isSeller = userId === seller._id;

  const addContact = async (user1Id, user2Id) => {
    try {
      await axios.post("http://localhost:3001/api/users/addContact", {
        user1Id,
        user2Id,
      });
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleSendMessageClick = async () => {
    if (!userId) {
      alert("Please log in to message the seller.");
      return;
    }
    await addContact(userId, seller._id);
    // Navigate to chat with the seller
    navigate(`/chat?newcontactemail=${seller.email}`);
  };

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
          data: { sellerId, listingId },
        });
      } else {
        await axios.patch(`http://localhost:3001/listing/${listingId}`, {
          status: "available",
        });
        await axios.post("http://localhost:3001/api/users/activeListings", {
          sellerId,
          listingId,
        });
        await axios.delete("http://localhost:3001/api/users/inactiveListings", {
          data: { sellerId, listingId },
        });
      }
    } catch (error) {
      console.error("Error marking listing as inactive:", error);
    }
  };

  const handleMarkAsInactive = async () => {
    await markAsInactive(listingDetails._id, seller._id, listingStatus);
    setListingStatus((prev) => (prev === "available" ? "unavailable" : "available"));
  };

  return (
    <div className="flex flex-col md:flex-row w-11/12 min-h-[85vh] md:h-[85vh] mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
      {/* LEFT SECTION: IMAGE */}
      <div className="md:w-2/3 w-full bg-gray-200 flex items-center justify-center px-4 md:px-10 py-6 h-auto md:h-full">
        <img
          src={listingDetails.image}
          alt="Product"
          className="w-full h-full object-contain"
        />
      </div>

      {/* RIGHT SECTION: DETAILS */}
      <div className="md:w-1/3 w-full min-w-[300px] max-h-[85vh] overflow-y-auto px-4 md:px-8 lg:px-12 py-6 flex justify-center">
        <div className="flex flex-col gap-4 w-full max-w-[500px] my-auto">
          {/* Title */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{listingDetails.title}</h1>
          </div>

          {/* Price */}
          <p className="text-lg mb-2">
            <strong>${listingDetails.price}</strong>
          </p>

          {/* Buttons: Mark as Inactive or Message Seller */}
          <div className="flex items-center gap-3 mb-5">
            {isSeller ? (
              <button
                onClick={handleMarkAsInactive}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
              >
                {listingStatus === "available" ? "Mark as Inactive" : "Mark as Active"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleSendMessageClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message
                </button>
                <button
                  className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition group"
                  aria-label="Add to Favorites"
                >
                  <Heart
                    className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:fill-red-500 transition-colors"
                    fill="none"
                  />
                </button>
              </>
            )}
          </div>

          {/* Condition */}
          <div className="flex mb-2">
            <p className="font-semibold mr-1">Condition: </p>
            <p className="font-normal">{listingDetails.condition}</p>
          </div>

          {/* Description */}
          <div className="mb-2">
            <h2 className="font-semibold mb-1">Description</h2>
            {listingDetails.description && listingDetails.description.trim() !== "" ? (
              listingDetails.description.split(/\n\s*\n/).map((para, idx) => (
                <p key={idx} className="text-sm text-gray-700 mb-2">
                  {para.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                Contact seller for details.
              </p>
            )}
          </div>

          <hr className="my-4 border-t border-gray-300" />

          {/* Seller */}
          <p className="text-lg mb-2">
            <strong>Seller</strong>
          </p>
          <div className="flex items-center gap-3">
            <img
              src={seller.profileImageUrl || "/images/defaultPFP.jpg"}
              alt={`${seller.fullName}'s profile`}
              className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-black/20"
            />
            <p className="text-gray-800 font-medium">{seller.fullName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
