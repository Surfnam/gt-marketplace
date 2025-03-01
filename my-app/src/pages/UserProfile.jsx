import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom";

function UserProfile({ userProp }) {
  const [editMode, seteditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState("default User");
  const [email, setEmail] = useState(null);
  const [bio, setBio] = useState(null);
  const [name, setName] = useState(null);
  const [interestedListings, setInterestedListings] = useState([]);
  const navigate = useNavigate();

  if (!userProp) {
    navigate("/login")
  }


  console.log("this is the user prop", userProp);
  const editHandler = async () => {
    const prev = editMode;
    seteditMode((prev) => !prev);
    console.log(editMode);
    if (prev) {
      try {
        const updates = {
          fullName: name,
          username: displayName,
          bio: bio,
        };
        console.log(updates);
        const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        console.log("userpropemial", userProp.email);
        let id = localStorage.getItem("userId");
        if (id == 'undefined') {
          const resp = await fetch(`http://localhost:3001/api/users/profile/${userProp.email}`);
          const userData = await resp.json();
          id = userData.user[0]._id
        }
        const resp = await fetch(`http://localhost:3001/api/users/${id}`);
        const data = await resp.json();
        setEmail(data.email);
        setUser(data || "temp user");
        setUserId(data._id || "defaultId");
        setDisplayName(data.username || "defaultusername");
        setName(data.fullName || "Default User");
        setDisplayName(data.username || "defaultusername");
        setBio(data.bio || "This is a default bio.");
        setInterestedListings(data.interestedListings || []);
        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };

    getUserData().then(() => {
      setLoading(false);
    });
    fetchFavorites();

  }, []);

  const fetchFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    setFavoriteListings(Object.values(storedFavorites)); //Convert object to array
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
    };

    fetchFavorites();

    //Listen for favorite updates
    window.addEventListener("favoritesUpdated", fetchFavorites);
    return () => window.removeEventListener("favoritesUpdated", fetchFavorites);
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
                    <img className="mx-auto h-20 w-20 rounded-full" src="https://GTMarketplace.s3.us-east-005.backblazeb2.com/defaultPFP.jpg" alt="Default User" />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:pt-1 sm:text-left">
                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">Default User</p>
                    <p className="text-sm font-medium text-gray-600">@defaultuser</p>
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
                  <dd className="mt-1 text-sm text-gray-900">default@example.com</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Joined</dt>
                  <dd className="mt-1 text-sm text-gray-900">January 2025</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900">This is a default bio.</dd>
                </div>
              </dl>
            </div>
            <div className="border-t border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
              <p className="text-sm text-gray-500">No active listings</p>
            </div>
            <div className="border-t border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg font-medium text-gray-900">Interested Listings</h3>
              <p className="text-sm text-gray-500">No interested listings</p>
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
                  <img className="mx-auto h-20 w-20 rounded-full" src={user.profilePicture || "https://via.placeholder.com/200"} alt={user.name || "Default User"} />
                </div>
                <div className="mt-4 sm:mt-0 sm:pt-1 sm:text-left">
                {editMode? (<input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter name" 
              className="text-xl font-bold text-gray-900  sm:text-2xl bg-transparent border-2 border-blue-300 outline-none"
            />) : (<p className="text-xl font-bold text-gray-900 sm:text-2xl">{name || "Default User"}</p>)}
                  {/* <p className="text-xl font-bold text-gray-900 sm:text-2xl">{name || "Default User"}</p> */}
                  {editMode? (<input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              placeholder="Enter username" 
              className="text-sm font-bold text-gray-900  bg-transparent border-2 border-blue-300 outline-none"
            />) : (<p className="text-sm font-medium text-gray-600">@{displayName || "defaultuser"}</p>)}
                  
                </div>
              </div>
              <div className="mt-5 sm:mt-0">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick = {editHandler}>
                  {editMode ? "Confirm" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{email || "default@example.com"}</dd>
                
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Joined</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.joinDate || "January 2025"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                {editMode? (<input 
              type="text" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Enter bio" 
              className="text-sm font-bold text-gray-900 bg-transparent border-2 border-blue-300  outline-none"
            />) : (<dd className="mt-1 text-sm text-gray-900">{bio || "This is a default bio."}</dd>)}
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {user.listings && user.listings.length > 0 ? (
                user.listings.map((listing) => (
                  <div key={listing.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{listing.title}</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">${listing.price}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a href={`/listing/${listing.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
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
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-gray-900">
              Interested Listings
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
