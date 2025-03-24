import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/App.css";
import { Heart } from "lucide-react";
import AuthModal from "../components/AuthModal";
import { useAuthCheck } from "../components/useAuthCheck";

const getAllListings = async () => {
  console.log('Fetching all listings...');
  try {
    const response = await fetch("http://localhost:3001/listing/active");
    const data = await response.json();
    console.log('Listings fetched successfully:', data.listings);
    return data.listings;
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};

function Home() {
  const navigate = useNavigate();
  const { showAuthModal, setShowAuthModal, checkAuth } = useAuthCheck();

  // State management
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("1000");
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    console.log('Initial favorites loaded from localStorage:', storedFavorites);
    return JSON.parse(storedFavorites) || {};
  });

  // Fetch listings on component mount
  useEffect(() => {
    getAllListings().then((data) => {
      console.log('Setting initial listings:', data);
      setListings(data || []);
      setFilteredListings(data || []);
    });
  }, []);

  // Filter listings when search or category changes
  useEffect(() => {
    console.log('Filtering listings with:', {
      searchTerm,
      selectedCategory,
      listingsCount: listings.length
    });
    
    const filtered = listings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || listing.category === selectedCategory)
    );
    console.log('Filtered listings count:', filtered.length);
    setFilteredListings(filtered);
  }, [searchTerm, selectedCategory, listings]);

  // Navigation and listing details
  const navigateToListingDetails = async (id) => {
    console.log('Fetching details for listing:', id);
    try {
      const response = await fetch(`http://localhost:3001/listing/${id}`);
      const data = await response.json();

      if (data) {
        console.log('Listing details found:', data);
        navigate(`/listing/${id}`, { state: { listing: data } });
      } else {
        console.error("Listing not found");
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
    }
  };

  // Favorites management
  const handleFavorite = async (listing) => {
    console.log('Handling favorite for listing:', listing._id);
    
    if (!listing._id) {
      console.error('Invalid listing ID');
      return;
    }

    const isAuthenticated = checkAuth(() => {
      const userId = localStorage.getItem("userId");
      const isFavorited = favorites[listing._id];
      console.log('User authenticated, updating favorites. Currently favorited:', isFavorited);

      setFavorites((prev) => {
        const newFavorites = { ...prev };
        if (isFavorited) {
          delete newFavorites[listing._id];
        } else {
          newFavorites[listing._id] = listing;
        }
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        console.log('Updated favorites in localStorage');
        return newFavorites;
      });

      updateFavoriteInDatabase(listing, isFavorited, userId);
    });

    if (!isAuthenticated) {
      console.log("User needs to authenticate");
    }
  };

  const updateFavoriteInDatabase = async (listing, isFavorited, userId) => {
    console.log('Updating favorite in database:', {
      listingId: listing._id,
      userId,
      action: isFavorited ? 'remove' : 'add'
    });
    
    try {
      // Update listing favorites
      const listingResponse = await fetch(`http://localhost:3001/listing/${listing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isFavorited ? "remove" : "add",
          userId,
        }),
      });
      console.log('Listing favorites update response:', listingResponse.ok);

      // Update user interested listings
      const url = "http://localhost:3001/users/interestedListings";
      const method = isFavorited ? "DELETE" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          listingId: listing._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update interestedListings in database");
      }

      console.log('Successfully updated user interested listings');
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  // Filter handlers
  const handleSearch = (e) => {
    console.log('Search term updated:', e.target.value);
    setSearchTerm(e.target.value);
  };
  
  const handleCategorySelect = (category) => {
    console.log('Category selected:', category);
    setSelectedCategory(category);
  };
  
  const handleFilter = (min, max) => {
    console.log('Applying price filter:', { min, max });
    setFilteredListings(
      listings.filter((listing) => listing.price >= min && listing.price <= max)
    );
  };

  // Categories list
  const categories = ["All", "Furniture", "Electronics", "Clothing"];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        {/* Sidebar filters */}
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
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className="w-full text-left hover:bg-gray-200 py-1 px-2 rounded"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
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
            <button
              className="mt-4 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition"
              onClick={() => handleFilter(minPrice, maxPrice)}
            >
              Apply
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mt-4 mb-4">
            <h1 className="text-2xl font-bold">Active Listings</h1>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded"
              onClick={() => {
                checkAuth(() => navigate("/createlisting"));
              }}
            >
              Create Listing
            </button>
          </div>

          {/* Listings grid */}
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
                  <div className="w-full flex">
                    <div className="w-[80%]">
                      <h2 className="text-lg font-semibold">{listing.title}</h2>
                      <p className="text-gray-600 mb-4">${listing.price}</p>
                    </div>
                    <div className="w-[20%]">
                      <button
                        onClick={() => handleFavorite(listing)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                      >
                        <Heart
                          size={24}
                          className={`transition-colors ${
                            favorites[listing._id]
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                          fill={favorites[listing._id] ? "red" : "none"}
                        />
                      </button>
                    </div>
                    <AuthModal
                      isOpen={showAuthModal}
                      onClose={() => setShowAuthModal(false)}
                    />
                  </div>
                  <button
                    onClick={() => navigateToListingDetails(listing._id)}
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
  );
}

export default Home;
