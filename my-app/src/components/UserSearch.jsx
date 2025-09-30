import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Mail, Calendar, Shield, Eye } from 'lucide-react';
import Pagination from './Pagination';

const UserSearch = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pagination, setPagination] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        role: roleFilter,
        page: currentPage.toString(),
        limit: '10',
        sortBy,
        sortOrder
      });
  
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/search?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setPagination(data.pagination || {});
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalUsers(data.pagination?.totalUsers || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, sortBy, sortOrder, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin' 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Search</h1>
          <p className="text-gray-600">Search users in the system</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by username, email, or full name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-6 rounded-md transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              
              {totalUsers > 0 && (
                <p className="text-sm text-gray-600">
                  Found {totalUsers} user{totalUsers !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
              <p className="text-sm text-gray-500 mt-2">

              </p>
            </div>
          ) : (
            <>
              {/* Users Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleUserClick(user._id)}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                          <img
                            src={user.profilePicture || '/images/defaultPFP.jpg'}
                            alt={user.fullName || user.username}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {user.fullName || user.username || 'No Name'}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              {user.role}
                            </span>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            {user.username && (
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span className="truncate">{user.username}</span>
                              </div>
                            )}
                            
                            {user.email && (
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                <span className="truncate">{user.email}</span>
                              </div>
                            )}

                            

                            {user.listings && user.listings.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {user.listings.length} listing{user.listings.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>

                          {user.bio && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {user.bio}
                            </p>
                          )}
                        </div>

                        {/* View Button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user._id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 p-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
