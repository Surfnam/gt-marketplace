import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";
import { getAllListings } from "./Home";

const getListingById = async (id) => {
  const listings = await getAllListings();
  return listings.find((listing) => listing.id === id);
};

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    getListingById(id).then((data) => setListing(data));
  }, [id]);

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <button onClick={() => navigate('/home')} className="mb-4 text-blue-500 hover:underline">
        Back to Listings
      </button>
      <div className="max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={listing.image} alt={listing.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
          <p className="text-gray-700 mb-4">Price: ${listing.price}</p>
          <p className="text-gray-700 mb-4">Description: {listing.description}</p>
          <p className="text-gray-700">Seller: {listing.sellerInfo}</p>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
