import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { set } from "mongoose";
// import { set } from 'mongoose';

const getTheUserData = async (paramUserId) => {
  try {
    const response = await axios.get(`/api/users/${paramUserId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

function UserProfile({ userProp }) {
  const [editMode, seteditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId: paramUserId } = useParams();
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [userId, setuserId] = useState(null);
  const [displayName, setdisplayName] = useState("default User");
  const [email, setEmail] = useState(null);
  const [bio, setBio] = useState(null);
  const [name, setName] = useState(null);

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
        // const res = await axios.patch(`http://localhost:3001/api/users/${userId}}`, updates);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = localStorage.getItem("userId");
        if (!id) {
          console.log("id nonexistent");
        }
        console.log(id);
        const resp = await fetch(`http://localhost:3001/api/users/${id}`);
        // const resp = await axios.get(`http://localhost:3001/api/users/${id}`);
        const data = await resp.json();
        console.log(data);
        console.log("THIS IS FROM ID DATA");
        setEmail(data.email);
        console.log(email);
        // const response = await axios.get(`http://localhost:3001/api/users/profile/${userProp.email}`);
        // console.log(response.data)
        // // const res = response.data
        // const res = response.data[0]
        // console.log(res)
        // console.log(res._id)
        setUser(data || "temp user");
        setuserId(data._id || "defaultId");
        setdisplayName(data.username || "defaultusername");
        setName(data.fullName || "Default User");
        setdisplayName(data.username || "defaultusername");
        setBio(data.bio || "This is a default bio.");
        console.log(user);
        console.log(userId);
        // console.log(bio)
        // console.log(user)
        // console.log(user)
        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };
    // setUser('temp user')
    // console.log(userProp)
    // setEmail(userProp.email)
    // console.log(email)
    // setBio('temp bio')
    // setName('temp name')

    getUserData().then(() => {
      setLoading(false);
    });
  }, []);

  const fetchFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    setFavoriteListings(Object.values(storedFavorites)); //Convert object to array
  };

  useEffect(() => {
    getTheUserData(paramUserId).then((data) => {
      console.log("fetch user data: ", data);
      setUser(data);
      setLoading(false);
    });
    fetchFavorites();
  }, [paramUserId]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(
          `http://localhost:3001/users/${paramUserId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        console.log("this is the paramuserid: ", paramUserId);
        const data = await response.json();

        setFavoriteListings(data.interestedListings || []);
      } catch (error) {
        console.error("Error fetching interested listings:", error);
      }
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
              onChange={(e) => setdisplayName(e.target.value)} 
              placeholder="Enter username" 
              className="text-sm font-bold text-gray-900  bg-transparent border-2 border-blue-300 outline-none"
            />) : (<p className="text-sm font-medium text-gray-600">@{displayName || "defaultuser"}</p>)}
                  
                </div>
              </div>
              <div className="mt-5 sm:mt-0">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick = {editHandler}>
                  {editMode? "Confirm" : "Edit Profile"}
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
