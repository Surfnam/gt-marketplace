import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/App.css";
import { Heart } from "lucide-react";
import { FiFilter } from "react-icons/fi";
import Icons from "../images/icons";
import Pagination from "../components/Pagination";

const fetchListings = async (page, category, min, max, search) => {
  try {
    let searchEmbedding = null;
    if (search) searchEmbedding = await getEmbedding(search);
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/listing/filter`,
      {
        page,
        category: category === "All" ? null : category,
        min,
        max,
        search: search === "" ? null : search,
        searchEmbedding,
      }
    );
    return res.data;
  } catch {
    return { listings: [], totalPages: 1 };
  }
};

const getEmbedding = async (text) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/listing/embedding`,
      { text }
    );
    return res.data.embedding;
  } catch (error) {
    if (error.response?.status === 429) alert("Too many requests");
    return null;
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

function Home( { checkAuth } ) {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("10000");
  const [tempMinPrice, setTempMinPrice] = useState("0");
  const [tempMaxPrice, setTempMaxPrice] = useState("10000");
  const [favorites, setFavorites] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "guest") return;
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/interestedListings`
    )
      .then((res) => res.json())
      .then((data) => {
        const favs = {};
        data.interestedListings.forEach((l) => (favs[l._id] = l));
        setFavorites(favs);
      });
  }, []);

  const navigateToListingDetails = async (id) => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/listing/${id}`
    );
    const data = await res.json();
    if (data) navigate(`/listing/${id}`, { state: { listing: data } });
  };

  const handleFavorite = (listing) => {
    if (!listing._id) return;
    const isAuthenticated = checkAuth(() => {
      const userId = localStorage.getItem("userId");
      const alreadyFav = favorites[listing._id];
      setFavorites((prev) => {
        const next = { ...prev };
        if (alreadyFav) delete next[listing._id];
        else next[listing._id] = listing;
        return next;
      });
      updateFavoriteInDatabase(listing, alreadyFav, userId);
    });
    if (!isAuthenticated) return;
  };

  const updateFavoriteInDatabase = async (listing, alreadyFav, userId) => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/listing/${listing._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: alreadyFav ? "remove" : "add",
            userId,
          }),
        }
      );
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/users/interestedListings`;
      const method = alreadyFav ? "DELETE" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, listingId: listing._id }),
      });
    } catch {
      setFavorites((prev) => {
        const next = { ...prev };
        if (alreadyFav) next[listing._id] = listing;
        else delete next[listing._id];
        return next;
      });
    }
  };

  const applySearch = () => setSearchTerm(tempSearchTerm);
  const applyPrice = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setPage(1);
  };

  const FilterPanel = () => (
    <>
      <label className="font-semibold mb-2">Search</label>
      <div className="mb-4">
        <input
          autoFocus
          placeholder="Search listings..."
          className="border border-gray-300 rounded-md p-2 w-full"
          value={tempSearchTerm}
          onChange={(e) => setTempSearchTerm(e.target.value)}
        />
        <button
          onClick={applySearch}
          className="mt-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition"
        >
          Apply
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Categories</h3>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c}>
              <button
                className={`w-full flex items-center text-left py-1 px-2 rounded ${
                  selectedCategory === c ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelectedCategory(c);
                  setPage(1);
                }}
              >
                {Icons[c] && (
                  <img
                    src={Icons[c]}
                    alt={c}
                    className="w-6 h-6 mr-4 shrink-0"
                  />
                )}
                {c}
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
            max="10000"
            value={tempMinPrice}
            onChange={(e) => setTempMinPrice(e.target.value)}
            placeholder="Min"
            className="w-1/2 border border-gray-300 rounded-md p-2 text-sm"
          />
          <span className="text-gray-600">-</span>
          <input
            type="number"
            min="0"
            max="10000"
            value={tempMaxPrice}
            onChange={(e) => setTempMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-1/2 border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>
        <button
          onClick={applyPrice}
          className="mt-4 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition"
        >
          Apply
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="md:hidden px-4 pt-4">
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          <FiFilter size={20} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setShowFilters(false)}
        >
          {/* ⬇ added pt‑24 so the drawer’s content clears the navbar */}
          <div
            className="absolute left-0 top-0 h-full w-3/4 max-w-xs bg-white pt-24 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterPanel />
            <button
              onClick={() => setShowFilters(false)}
              className="mt-6 w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 flex">
        <aside className="hidden md:block w-64 mr-8 flex flex-col sticky top-24">
          <FilterPanel />
        </aside>
        <main className="flex-1">
          <div className="flex justify-between items-center mt-4 mb-4">
            <h1 className="text-2xl font-bold">Active Listings</h1>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded"
              onClick={() => checkAuth(() => navigate("/createlisting"))}
            >
              Create Listing
            </button>
          </div>
          <div style={{ minHeight: "900px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
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
                        <h2 className="text-lg font-semibold">
                          {listing.title}
                        </h2>
                        <p className="text-gray-600 mb-4">${listing.price}</p>
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
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </main>
      </div>
    </div>
  );
}

export default Home;
