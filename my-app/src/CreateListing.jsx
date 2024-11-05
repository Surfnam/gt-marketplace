import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object to send the image file
    console.log("test");
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const userId = "input_user_id"
      const response = await fetch(`/api/listings/${userId}`, { //idk where fetch api
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Listing created:', result);
        navigate('/'); // Redirect to home page after successful creation
      } else {
        console.error('Failed to create listing');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select a category</option>
              <option value="Furniture">Furniture</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="mt-1 block w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;