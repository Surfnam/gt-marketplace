import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/App.css";
import { Heart } from "lucide-react";
import Icons from "../images/icons";
import Pagination from "../components/Pagination";

// For embedding
const getEmbedding = async (text) => {
  try {
    const res = await axios.post("http://localhost:3001/listing/embedding", {
      text,
    });
    return res.data.embedding;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      alert("Too many requests! Please wait and try again later.");
    } else {
      console.error("Error fetching embedding:", error);
    }
    return null;
  }
};

const fetchListings = async (page, category, min, max, search) => {
  try {
    let searchEmbedding = null;
    if (search) {
      searchEmbedding = await getEmbedding(search);
    }
    const res = await axios.post("http://localhost:3001/listing/filter", {
      page,
      category: category === "All" ? null : category,
      min,
      max,
      search: search === "" ? null : search,
      searchEmbedding,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], totalPages: 1 };
  }
};

const categories = [
  "All",
  "Furniture",
  "Electronics",
  "Clothing",
  "Vehicles",
  "Property Rentals",
  "Entertainment",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
  "Other",
];

function Home() {
  const navigate = useNavigate();

  // Listings data
  const [listings, setListings] = useState([]);
  // Category
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  // Price
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("1000");
  const [tempMinPrice, setTempMinPrice] = useState("0");
  const [tempMaxPrice, setTempMaxPrice] = useState("1000");
  // Favorites
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || {};
  });
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Controls whether the sidebar is open on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch listings whenever filters/pagination change
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchListings(
        page,
        selectedCategory,
        minPrice,
        maxPrice,
        searchTerm
      );
      setListings(data.listings || []);
      setTotalPages(data.totalPages || 1);
    };
    fetchData();
  }, [page, selectedCategory, minPrice, maxPrice, searchTerm]);

  // Navigate to details
  const navigateToListingDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/listing/${id}`);
      const data = await response.json();
      if (data) {
        navigate(`/listing/${id}`, { state: { listing: data } });
      } else {
        console.error("Listing not found");
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
    }
  };

  // Favorite/unfavorite logic
  const handleFavorite = async (listing) => {
    if (!listing._id) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const isFavorited = favorites[listing._id];

    // Update local state quickly for UI
    setFavorites((prev) => {
      const newFavorites = { ...prev };
      if (isFavorited) {
        delete newFavorites[listing._id];
      } else {
        newFavorites[listing._id] = listing;
      }
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });

    try {
      // Update the listing's interestedUsers array
      await fetch(`http://localhost:3001/listing/${listing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isFavorited ? "remove" : "add",
          userId,
        }),
      });

      // Update user's interestedListings array
      await fetch(`http://localhost:3001/api/users/${userId}/interestedListings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isFavorited ? "remove" : "add",
          listingId: listing._id,
        }),
      });

      console.log(
        `Successfully ${isFavorited ? "removed" : "added"} listing ${listing._id}`
      );
    } catch (error) {
      console.error("Error updating favorite:", error);
    }

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // Category
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    setSidebarOpen(false); // close sidebar on mobile
  };

  // Search
  const applySearchTerm = () => {
    setSearchTerm(tempSearchTerm);
    setPage(1);
    setSidebarOpen(false); // close sidebar on mobile
  };

  // Price
  const applyPriceFilter = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setPage(1);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top row: "Filters" button on mobile, heading, "Create Listing" */}
        <div className="flex items-center justify-between mb-4">
          {/* Only show "Filters" button on mobile */}
          <button
            className="inline-flex md:hidden items-center bg-gray-700 text-white px-4 py-2 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            Filters
          </button>

          <h1 className="text-2xl font-bold">Active Listings</h1>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded"
            onClick={() => navigate("/createlisting")}
          >
            Create Listing
          </button>
        </div>

        {/* Main container: sidebar + listings */}
        <div className="flex flex-col md:flex-row relative">
          {/* SIDEBAR (One element for both mobile and desktop) */}
          <aside
            className={`
              bg-white z-50 shadow-lg transform transition-transform duration-300 
              fixed top-0 left-0 w-64
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              h-full overflow-y-auto  /* Ensure sidebar can scroll on mobile */
              md:translate-x-0 md:static md:w-64 md:mr-8 md:h-auto md:block md:overflow-y-visible
            `}
          >
            {/* Close button for mobile only */}
            <div className="flex md:hidden justify-end p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-600 hover:text-gray-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Sidebar content */}
            <div className="p-4">
              {/* SEARCH */}
              <label className="font-semibold mb-2 block">Search</label>
              <div className="mb-4">
                <input
                  placeholder="Search listings..."
                  className="border border-gray-300 rounded-md p-2 w-full"
                  value={tempSearchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                />
                <button
                  onClick={applySearchTerm}
                  className="mt-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition w-full"
                >
                  Apply
                </button>
              </div>

              {/* CATEGORIES */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`w-full flex items-center text-left py-1 px-2 rounded ${
                          selectedCategory === cat
                            ? "bg-gray-200"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        {Icons[cat] && (
                          <img
                            src={Icons[cat]}
                            alt={`${cat} icon`}
                            className="w-6 h-6 mr-4"
                          />
                        )}
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PRICE RANGE */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 border border-gray-300 rounded-md p-2 text-sm"
                  />
                  <span className="text-gray-600">-</span>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <button
                  className="mt-4 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition w-full"
                  onClick={applyPriceFilter}
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile (dark background when sidebar is open) */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-25 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* MAIN CONTENT: Listings + Pagination */}
          <main className="flex-1 mt-8 md:mt-0">
            <div style={{ minHeight: "900px" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
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
                          <h2 className="text-lg font-semibold">
                            {listing.title}
                          </h2>
                          <p className="text-gray-600 mb-4">
                            ${listing.price}
                          </p>
                        </div>
                        <div className="w-[20%]">
                          {listing.seller === localStorage.getItem("userId") ? (
                            <span className="inline-block px-2 bg-green-100 text-green-800 text-xs font-bold rounded">
                              My Listing
                            </span>
                          ) : (
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
                          )}
                        </div>
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
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
