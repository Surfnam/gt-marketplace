import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import MiniPagination from "../components/MiniPagination";

function UserProfile({ userProp }) {
  const [editMode, seteditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState("default User");
  const [email, setEmail] = useState(null);
  const [bio, setBio] = useState(null);
  const [name, setName] = useState(null);
  
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [listingIdToDelete, setListingIdToDelete] = useState(null);
  const [listingToDelete, setListingToDelete] = useState(null);

  const [activeListings, setActiveListings] = useState([]);
  const [totalActiveListingsPages, setTotalActiveListingsPages] = useState(1);
  const [activePage, setActivePage] = useState(1);

  const [interestedListings, setInterestedListings] = useState([]);
  const [totalInterestedListingsPages, setTotalInterestedListingsPages] = useState(1);
  const [interestedPage, setInterestedPage] = useState(1);

  const [inactiveListings, setInactiveListings] = useState([]);
  const [totalInactiveListingsPages, setTotalInactiveListingsPages] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  if (!userProp) {
    navigate("/login");
  }

  const confirmDelete = (listingId) => {
    setListingIdToDelete(listingId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (listingIdToDelete) {
      await handleDeleteListing(listingIdToDelete);
      setShowConfirm(false);
      setListingIdToDelete(null);
    }
  };

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

  const getUserData = async () => {
    try {
      let id = localStorage.getItem("userId");
      if (id == 'undefined') {
        const res = await axios.get(`http://localhost:3001/api/users/profile/${userProp.email}`);
        const userData = res.data;
        id = userData.user[0]._id
      }

      const res = await axios.get(`http://localhost:3001/api/users/${id}/paginated`, {
        params: {
          activePage: activePage,
          interestedPage: interestedPage,
          inactivePage: inactivePage
        }
      });
      const data = res.data;

      setEmail(data.email);
      setUser(data || "temp user");
      setUserId(data._id || "defaultId");
      setDisplayName(data.username || "defaultusername");
      setName(data.fullName || "Default User");
      setBio(data.bio || "This is a default bio.");

      console.log("active: ", data.activeListings);
      setActiveListings(data.activeListings);
      setTotalActiveListingsPages(data.totalActiveListingsPages);

      setInterestedListings(data.interestedListings);
      setTotalInterestedListingsPages(data.totalInterestedListingsPages);

      setInactiveListings(data.inactiveListings);
      setTotalInactiveListingsPages(data.totalInactiveListings)
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (listingIdToDelete) {
      getListingById(listingIdToDelete).then((data) => {
        setListingToDelete(data); 
      });
    }
  }, [listingIdToDelete]); 

  useEffect(() => {
    getUserData().then(() => {
      setLoading(false);
    });

  }, [activePage, interestedPage, inactivePage]);

  const handleDeleteListing = async (listingId) => {
    try {
      await axios.delete(`http://localhost:3001/listing/${listingId}`);
      await getUserData();
    } catch (err) {
      console.log(err);
    }
  };

  const getListingById = async (listingId) => {
    try {
      const res = await axios.get(`http://localhost:3001/listing/${listingId}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

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
              {activeListings.length > 0 ? (
                activeListings.map((listing) => (
                  <div key={listing._id} className="bg-white overflow-hidden shadow rounded-lg">
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
                    <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                      <div className="text-sm">
                        <a href={`/listing/${listing._id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                          View details
                        </a>
                      </div>
                      <div className="flex items-center justify-end gap-x-3">
                          <a href={`/edit-listing/${listing._id}`} className="text-gray-500 hover:text-blue-500">
                              <FaPencilAlt size={18} />
                          </a>

                          <button 
                              onClick={() => confirmDelete(listing._id)}
                              className="text-gray-600 hover:text-gray-800"
                          >
                              <FaTrash className="h-5 w-5" />
                          </button>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No active listings</p>
              )}
            </div>
            {activeListings.length > 0 &&  (
              <MiniPagination
                currentPage={activePage}
                totalPages={totalActiveListingsPages}
                onPageChange={setActivePage}
              />
            )}
          </div>

          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-gray-900">
              Interested Listings
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {interestedListings.length > 0 ? (
                interestedListings.map((listing) => (
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
                <p className="text-sm text-gray-500">No interested listings</p>
              )}
            </div>
            {interestedListings.length > 0 && (
              <MiniPagination
                currentPage={interestedPage}
                totalPages={totalInterestedListingsPages}
                onPageChange={setInterestedPage}
              />
            )}
          </div>

          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-gray-900">Inactive Listings</h3>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {inactiveListings.length > 0 ? (
                inactiveListings.map((listing) => (
                  <div key={listing._id} className="bg-white overflow-hidden shadow rounded-lg">
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
                    <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                      <div className="text-sm">
                        <a href={`/listing/${listing._id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                          View details
                        </a>
                      </div>
                      <div className="flex items-center justify-end gap-x-3">
                          <a href={`/edit-listing/${listing._id}`} className="text-gray-500 hover:text-blue-500">
                              <FaPencilAlt size={18} />
                          </a>

                          <button 
                              onClick={() => confirmDelete(listing._id)}
                              className="text-gray-600 hover:text-gray-800"
                          >
                              <FaTrash className="h-5 w-5" />
                          </button>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No inactive listings</p>
              )}
            </div>
            {inactiveListings.length > 0 && (
              <MiniPagination
                currentPage={inactivePage}
                totalPages={totalInactiveListingsPages}
                onPageChange={setInactivePage}
              />
            )}
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
    {showConfirm && listingToDelete && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Are you sure you want to delete listing <span className="font-bold italic">{listingToDelete.title}</span>?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
