import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../services/fileUpload";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const user = localStorage.getItem("userId");

function CreateListing() {
  const [currentImage, setCurrentImage] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    seller: user,
    price: "",
    condition: "None",
    category: "",
    description: "",
    image: null,
    status: "available",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file, // Store selected file
      }));

      // Create a temporary URL for preview
      const imagePreviewUrl = URL.createObjectURL(file);
      setCurrentImage(imagePreviewUrl); // Update the image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the image file
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append("file", formData.image);

        const uploadResponse = await fetch(
          `http://localhost:3001/api/fileUpload`,
          {
            method: "PUT",
            body: imageFormData,
          }
        );

        if (!uploadResponse.ok) {
          const errorDetails = await uploadResponse.json(); // Get error details from the server response
          console.error("Error uploading image:", errorDetails);
          throw new Error("Failed to upload image");
        }

        const uploadResult = await uploadResponse.json();
        formData.image = uploadResult.fileURL; // Use the new image URL from Backblaze
      }

      const response = await fetch(`http://localhost:3001/listing/${user}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          uid: user._uid,
          email: user.email,
          data: formData,
          title: formData.title,
          seller: formData.seller,
          price: formData.price,
          condition: formData.condition,
          category: formData.category,
          description: formData.description,
          status: formData.status,
          image: formData.image,
        }),
        credentials: "include",
      });
      await uploadFile(formData.image);
      console.log("User data sent to MongoDB:", response.listingId);

      navigate("/");
    } catch (error) {
      console.error("Error sending user data to MongoDB:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <Link
          to="/"
          className="flex items-center mb-6 transition-colors text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="mr-2" />
          Back to Marketplace
        </Link>
        <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
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
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
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
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
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
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
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
