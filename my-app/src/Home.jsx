import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const getAllListings = async () => {
  //example placeholders
  const response = await fetch("http://localhost:3001/listing/active");
  const data = await response.json();
  return data.data;
};

function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("1000");

  useEffect(() => {
    getAllListings().then((data) => {
      setListings(data || []);
      setFilteredListings(data || []);
    });
  }, []);

  useEffect(() => {
    
    const filtered = listings.filter(listing => {
      const filterByPrice = listing.price >= minPrice && listing.price <= maxPrice
      const filterSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      const filterCategory = (selectedCategory === "All" || listing.category === selectedCategory)
      return filterByPrice && filterSearch && filterCategory
    }
    );
    setFilteredListings(filtered);
    console.log(filteredListings)
  }, [searchTerm, selectedCategory, listings,minPrice,maxPrice]);

  const navigateToListingDetails = (id) => {
    navigate(`/listing/${id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  }

  const handleFilter = (minPrice, maxPrice) => {
    setFilteredListings(listings.filter(listing => listing.price >= minPrice && listing.price <= maxPrice));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        <aside className="w-64 mr-8 flex flex-col">
          <label className="font-semibold mb-2">Filters</label>
          <input
            placeholder="Search listings..."
            className="border border-gray-300 rounded-md p-2 mb-4"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Categories</h3>
            <ul className="space-y-2">
              {["All", "Furniture", "Electronics", "Clothing"].map(
                (category) => (
                  <li key={category}>
                    <button className="w-full text-left hover:bg-gray-200 py-1 px-2 rounded" onClick={() => handleCategorySelect(category)}> 
                      {category}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="mt-6">
    <h3 className="font-semibold mb-2">Price Range</h3>
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        max="1000"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min"
        className="w-1/2 border border-gray-300 rounded-md p-2 text-sm"
      />
      <span className="text-gray-600">-</span>
      <input
        type="number"
        min="0"
        max="1000"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max"
        className="w-1/2 border border-gray-300 rounded-md p-2 text-sm"
      />
    </div>
    {/* <button
  className="mt-4 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition"
  onClick={() => {handleFilter(minPrice, maxPrice)}}
>
  Apply
</button> */}
{/* apply filters when button pressed or automatic filter?*/}
  </div>
        </aside>
        <div className="p-4">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-6 ml-4">Active Listings</h1>
            <button
              onClick={() => navigate("/createlisting")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold mb-6 mr-4 py-2 px-4 rounded"
            >
              Create Listing
            </button>
          </div>
        <main className="flex-1">
          {/* <h1 className="text-2xl font-bold mb-6">Active Listings</h1> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    {listing.title}
                  </h2>
                  <p className="text-gray-600 mb-4">${listing.price}</p>
                  <button
                    onClick={() => navigateToListingDetails(listing.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}

export default Home;
