import { ShoppingBag } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'

const getAllListings = async () => {
  //example placeholders
  return [
    { id: '1', title: 'chair', price: 50},
    { id: '2', title: 'lamp', price: 30},
    { id: '3', title: 'sofa', price: 100},
    { id: '4', title: 'clock', price: 200},
    { id: '5', title: 'table', price: 150},
    { id: '6', title: 'Bookshelf', price: 80},
  ];
};

function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getAllListings().then(setListings);
  }, []) 

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  const navigateToListingDetails = (id) => {
    navigate(`/listing/${id}`);
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag className="h-8 w-8 text-blue-500 mr-2" />
            <span className="text-xl font-bold">GTMarketplace</span>
          </div>
          <div className="flex items-center space-x-4">
          <button onClick={navigateToLogin} type="submit" className="auth-button">Login</button>
          <button onClick={navigateToRegister} type="submit" className="auth-button">Register</button>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex'>
        <aside className='w-64 mr-8 flex flex-col'>
        <label className='font-semibold mb-2'>Filters</label>
          <input placeholder='Search listings...' className='border border-gray-300 rounded-md p-2 mb-4'/>
          <div className='mt-4'>
            <h3 className='font-semibold mb-2'>Categories</h3>
            <ul className='space-y-2'>
            {['All', 'Furniture', 'Electronics', 'Clothing'].map((category) => (
                <li key={category}>
                  <button className='w-full text-left hover:bg-gray-200 py-1 px-2 rounded'>
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className='flex-1'>
          <h1 className='text-2xl font-bold mb-6'>Active Listings</h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
                  <p className="text-gray-600 mb-4">${listing.price}</p>
                  <button 
                    onClick={() => navigateToListingDetails(listing.id)}
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
  )
}

export default Home