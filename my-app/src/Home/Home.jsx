import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Heart } from "lucide-react";
import Icons from "../assets/icons";
import Pagination from "../Pagination/Pagination";
import { IoIosSearch } from "react-icons/io";
import debounce from "lodash.debounce";

const fetchListings = async (page, category, min, max, search) => {
  try {
    let searchEmbedding = null;
    if (search) {
      searchEmbedding = await getEmbedding(search); 
    }
    const res = await axios.post("http://localhost:3001/listing/filter", {
      page,
      'category': category === "All" ? null : category,
      min,
      max,
      'search': search === "" ? null : search,
      searchEmbedding,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], totalPages: 1 };
  }
};

const getEmbedding = async (text) => {
  try {
    const res = await axios.post("http://localhost:3001/listing/embedding", { text });
    return res.data.embedding;
  } catch (error) {
    if (error.response.status === 429) {
      alert("Too many requests! Please wait and try again later.");
    }
    return null;
  }
};

const categories = ["All", "Furniture", "Electronics", "Clothing", "Vehicles", "Property Rentals",
  "Entertainment", "Free Stuff", "Garden & Outdoor", "Hobbies", "Home Goods", "Home Improvement", 
  "Musical Instruments", "Office Supplies", "Pet Supplies", "Sporting Goods", "Toys & Games", "Other"]


function Home() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("1000");

  const [tempMinPrice, setTempMinPrice] = useState("0");
  const [tempMaxPrice, setTempMaxPrice] = useState("1000");

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || {};
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearchTerm = debounce((term) => {
    setSearchTerm(term);
  }, 200);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchListings(page, selectedCategory, minPrice, maxPrice, searchTerm);
      setListings(data.listings || []);
      setTotalPages(data.totalPages || 1);
    };
  
    fetchData();

  }, [page, selectedCategory, minPrice, maxPrice, searchTerm]);

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleFavorite = async (listing) => {
    if (!listing._id) return;

    const userId = localStorage.getItem("userId"); //Assuming userId is stored in localStorage
  if (!userId) {
    console.error("User not logged in");
    return;
  }

  const isFavorited = favorites[listing._id];

  //Update local state first for instant UI response
  setFavorites((prev) => {
    const newFavorites = { ...prev };

    if (isFavorited) {
      delete newFavorites[listing._id]; //Unfavorite
    } else {
      newFavorites[listing._id] = listing; //Favorite
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    return newFavorites;
    });
    try {
      //Update the listing's interestedUsers array
      await fetch(`http://localhost:3001/listing/${listing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isFavorited ? "remove" : "add", //Remove if already favorited, otherwise add
          userId,
        }),
      });
  
      // Update the user's interestedListings array
      await fetch(`http://localhost:3001/api/users/${userId}/interestedListings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: isFavorited ? "remove" : "add",
            listingId: listing._id,
        }),
      });
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  
    //Dispatch event to notify UserProfile of updates
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };
  
  const handlePriceFilterSelect = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setPage(1);
  };

  return (
    <div className="home">
      <div className="home-content">
        <aside className="sidebar">
          <div className="listing-search">
            <IoIosSearch className="icon" />
            <input 
                type="text" 
                placeholder="Search Listings" 
                value={tempSearchTerm}
                onChange={e => {
                  setTempSearchTerm(e.target.value)
                  debouncedSearchTerm(e.target.value)
                }}
            />
          </div>
          <div className="category-box">
            <h1 className="category-title">Categories</h1>
            <hr  className="break-line" />
            <ul className="category-item">
              {categories.map(
                (category) => (
                  <li key={category}>
                    <button
                      className={
                       `category-button
                        ${
                          selectedCategory === category 
                            ? 'bg-gray-200'  // Highlight if selected
                            : 'hover:bg-gray-200' // Otherwise, highlight on hover
                        }`
                      }
                      onClick={() => handleCategorySelect(category)}
                    >
                    {Icons[category] && (
                      <img
                        src={Icons[category]}
                        alt={`${category} icon`}
                        className="category-icon"
                      />
                    )}
                      {category}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="price-box">
            <h1 className="price-title">Price Range</h1>
            <hr  className="break-line" />
            <div className="price-content">
              <input
                type="number"
                min="0"
                max="1000"
                value={tempMinPrice}
                onChange={(e) => setTempMinPrice(e.target.value)}
                placeholder="Min"
              />
              <span className="middle-span">-</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={tempMaxPrice}
                onChange={(e) => setTempMaxPrice(e.target.value)}
                placeholder="Max"
              />
            </div>
            <button
              className="apply-button"
              onClick={() => {
                handlePriceFilterSelect();
              }}
            >
              Apply
            </button>
          </div>
        </aside>
        <main className="listing-page">
          <div className="listing-header">
            <h1 className="listing-title">{selectedCategory} Listings</h1>
            <button
              className="create-listing-button"
              onClick={() => navigate("/createlisting")}
            >
              Create Listing
            </button>
          </div>
          <div>
          <div className="listings">
            {filteredListings.map((listing) => (
              <div
                key={listing._id}
                className="listing-box"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="listing-image"
                />
                <div className="listing-description-box">
                  <div className="listing-description-content">
                    <div className="listing-text">
                      <h2 className="listing-description-title">{listing.title}</h2>
                      <p className="listing-description-price">${listing.price}</p>
                    </div>
                    <div className="heart-icon">
                      {listing.seller === localStorage.getItem("userId") ? (
                        <span className="my-listing">
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
                    className="view-listing-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>

          {/* Pagination Controls */}
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