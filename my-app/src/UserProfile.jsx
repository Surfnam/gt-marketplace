import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const getUserData = async (userId) => {
  // This would typically be an API call
  await new Promise(resolve => setTimeout(resolve, 1500)); //displays and simulates loading page
  return {
    id: userId,
    name: "kevin zhang",
    username: "zhang123",
    email: "kevin.zhang@example.com",
    profilePicture: "https://via.placeholder.com/200",
    bio: "i love gt marketplace!!!",
    joinDate: "January 2025",
    listings: [
      { id: "1", title: "Chair", price: 50 },
      { id: "2", title: "Gaming Laptop", price: 800 },
      { id: "3", title: "Among-us T-shirt", price: 30 },
    ]
  };
};

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    getUserData(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-8">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  <img className="mx-auto h-20 w-20 rounded-full" src={user.profilePicture} alt={user.name} />
                </div>
                <div className="mt-4 sm:mt-0 sm:pt-1 sm:text-left">
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">{user.name}</p>
                  <p className="text-sm font-medium text-gray-600">@{user.username}</p>
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
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Joined</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.joinDate}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.bio}</dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {user.listings.map((listing) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;