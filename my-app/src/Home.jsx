import { ShoppingBag } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToRegister = () => {
    navigate('/register');
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
          <input placeholder='Search listings...'/>
          <div className='mt-4'>
            <h3 className='font-semibold mb-2'>Categories</h3>
            <ul className='space-y-2'>
              <li><button className='justify-start'>All</button></li>
              <li><button className='justify-start'>Furniture</button></li>
              <li><button className='justify-start'>Electronics</button></li>
              <li><button className='justify-start'>Clothing</button></li>
            </ul>
          </div>
        </aside>

        <main className='flex-1'>
          <h1 className='text-2xl font-bold mb-6'>Active Listings</h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home