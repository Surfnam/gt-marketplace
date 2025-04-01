import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";

const getListing = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/listing/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
};

const getSeller = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/api/users/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching seller:", error);
    return null;
  }
};

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

const ListingDetails = () => {
  const { id } = useParams();
  const [listingDetails, setListingDetails] = useState(null);
  const [seller, setSeller] = useState(null);
  const [listingStatus, setListingStatus] = useState("");
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && listingDetails) {
      // Check if listing is favorited by current user
      fetch(`http://localhost:3001/api/users/${userId}/interestedListings`)
        .then(res => res.json())
        .then(data => {
          const isFav = data.interestedListings.some(listing => listing._id === listingDetails._id);
          setIsFavorited(isFav);
        })
        .catch(error => console.error("Error checking favorite status:", error));
    }
  }, [listingDetails]);

  if (!listingDetails || !seller) {
    return <div className="p-8 text-center">Loading...</div>;
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
  };

  const handleMarkAsInactive = async () => {
    await markAsInactive(listingDetails._id, seller._id, listingStatus);
    setListingStatus((prev) => (prev === "available" ? "unavailable" : "available"));
  };

  const handleFavorite = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // Handle unauthenticated user
      return;
    }

    try {
      const url = "http://localhost:3001/api/users/interestedListings";
      const method = isFavorited ? "DELETE" : "POST";
      
      // Update listing's interestedUsers array
      const listingResponse = await fetch(
        `http://localhost:3001/listing/${listingDetails._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: isFavorited ? "remove" : "add",
            userId,
          }),
        }
      );

      if (!listingResponse.ok) {
        throw new Error("Failed to update listing's interestedUsers");
      }

      // Update user's interested listings
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          listingId: listingDetails._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user's interestedListings");
      }

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <div className="flex flex-col mds:flex-row w-11/12 min-h-[85vh] mds:h-[85vh] mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
        {/* Left Side of Page with Image */}
        <div className="mds:basis-2/3 basis-1/2 bg-gray-200 flex items-center justify-center px-4 mds:px-10 py-6 mds:h-full">
        <img
            src={listingDetails.image}
            alt="Product"
            className="w-full h-full object-contain"
        />
        </div>

        {/* Right side of page */}
        <div className="mds:basis-1/3 basis-1/2 min-w-[350px] max-h-[85vh] overflow-y-auto px-4 mds:px-20 py-6 flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[500px] self-center my-auto">
                {/* Listing Title */}
                <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{listingDetails.title}</h1>
                </div>

                {/* Price */}
                <p className="text-lg mb-2">
                <strong>${listingDetails.price}</strong>
                </p>

                {/* Message Seller / Mark Inactive Button & Heart Button*/}
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
                            onClick={handleFavorite}
                            className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition group"
                            aria-label="Add to Favorites"
                            >
                            <Heart
                                className={`w-5 h-5 transition-colors ${
                                    isFavorited ? "text-red-500 fill-red-500" : "text-gray-400 group-hover:text-red-500 group-hover:fill-red-500"
                                }`}
                                fill={isFavorited ? "red" : "none"}
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
                    listingDetails.description
                    .split(/\n\s*\n/)
                    .map((para, idx) => (
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
                    <p className="text-sm text-gray-500 italic">Contact seller for details.</p>
                )}
                </div>

                <hr className="my-4 border-t border-gray-300" />

                {/* Seller Details */}
                <p className="text-lg mb-2">
                <strong>Seller</strong>
                </p>
                <div className="flex items-center gap-3">
                <img
                    src={seller.profilePicture || "/images/defaultPFP.jpg"}
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
