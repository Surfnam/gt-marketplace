import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get listing ID from URL

  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    condition: "New",
    category: "",
    description: "",
    status: "available",
    image: null,
  });

  // State to store the original data for comparison
  const [originalData, setOriginalData] = useState({});

  const [currentImage, setCurrentImage] = useState(null); // Stores current image URL

  // Fetch listing details when component loads
  useEffect(() => {
    fetch(`http://localhost:3001/listing/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title,
          price: data.price,
          condition: data.condition,
          category: data.category,
          description: data.description,
          status: data.status,
          image: null, // Reset file input
        });

        setOriginalData(data); // Store the original data for comparison

        if (data.image) {
          setCurrentImage(data.image); // Store the existing image URL
        }
      })
      .catch((err) => console.error("Error fetching listing:", err));
  }, [id]);

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

    let updatedData = {}; // Store only modified fields

    // Compare new values with originalData before adding them to updatedData
    if (formData.title !== originalData.title) updatedData.title = formData.title;
    if (formData.price !== originalData.price) updatedData.price = formData.price;
    if (formData.condition !== originalData.condition) updatedData.condition = formData.condition;
    if (formData.category !== originalData.category) updatedData.category = formData.category;
    if (formData.description !== originalData.description) updatedData.description = formData.description;
    if (formData.status !== originalData.status) updatedData.status = formData.status;

    try {
      // Step 1: Upload the image to Backblaze if a new file was selected
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append("file", formData.image);

        const uploadResponse = await fetch(`http://localhost:3001/api/fileUpload`, {
          method: "PUT",
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadResult = await uploadResponse.json();
        updatedData.image = uploadResult.fileURL; // Use the new image URL from Backblaze
      }

      // Step 2: Send a PATCH request with only modified fields
      const patchResponse = await fetch(`http://localhost:3001/listing/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (!patchResponse.ok) {
        throw new Error("Failed to update listing");
      }

      console.log("Listing updated successfully");
      navigate("/profile"); // Redirect to profile after saving
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price ($)
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

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
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

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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

        {/* Image Upload */}
        <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
            </label>

            <div className="grid grid-cols-2 gap-4 items-center mt-1">
                {/* File Upload (Left Side) */}
                <div className="w-full overflow-hidden">
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="mt-1 block w-full overflow-hidden text-ellipsis truncate whitespace-nowrap rounded-md p-1"
                    />
                </div>

                {/* Image Preview (Right Side) */}
                {currentImage && (
                    <div className="flex justify-center">
                        <img
                            src={currentImage}
                            alt="Selected Listing"
                            className="max-w-full max-h-48 h-auto object-contain rounded"
                        />
                    </div>
                )}
            </div>
        </div>

        <div className="flex justify-between mt-6">
            {/* Cancel Button */}
            <button
                type="button"
                onClick={() => navigate("/profile")} // Redirects to profile when canceled
                className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
                Cancel
            </button>

            {/* Save Changes Button */}
            <button
                type="submit"
                className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
                Save Changes
            </button>
        </div>

        </form>
      </div>
    </div>
  );
}

export default EditListing;
