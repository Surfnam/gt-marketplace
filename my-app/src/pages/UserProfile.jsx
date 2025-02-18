import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const getUserData = async (userId) => {
  try {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const [favoriteListings, setFavoriteListings] = useState([]);

  const fetchFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    setFavoriteListings(Object.values(storedFavorites)); // Convert object to array
  };

  useEffect(() => {
    getUserData(userId).then((data) => {
      console.log("fetch user data: ", data);
      setUser(data);
      setLoading(false);
    });
    fetchFavorites();
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex sm:space-x-5">
                  <div className="flex-shrink-0">
                    <img
                      className="mx-auto h-20 w-20 rounded-full"
                      src="https://GTMarketplace.s3.us-east-005.backblazeb2.com/defaultPFP.jpg"
                      alt="Default User"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:pt-1 sm:text-left">
                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                      Default User
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      @defaultuser
                    </p>
                  </div>
                </div>
                <div className="mt-5 sm:mt-0">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-6 sm:p-8">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    default@example.com
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Joined</dt>
                  <dd className="mt-1 text-sm text-gray-900">January 2025</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    This is a default bio.
                  </dd>
                </div>
              </dl>
            </div>
            <div className="border-t border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-gray-900">
              Active Listings
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteListings.length > 0 ? (
                favoriteListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {listing.title}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                ${listing.price}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a
                          href={`/listing/${listing._id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View details
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No active listings</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  <img
                    className="mx-auto h-20 w-20 rounded-full"
                    src={
                      user.profilePicture || "https://via.placeholder.com/200"
                    }
                    alt={user.name || "Default User"}
                  />
                </div>
                <div className="mt-4 sm:mt-0 sm:pt-1 sm:text-left">
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {user.name || "Default User"}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    @{user.username || "defaultuser"}
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-0">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.email || "default@example.com"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Joined</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.joinDate || "January 2025"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.bio || "This is a default bio."}
                </dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-gray-900">
              Active Listings
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteListings.length > 0 ? (
                favoriteListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {listing.title}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                ${listing.price}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a
                          href={`/listing/${listing._id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View details
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No active listings</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
