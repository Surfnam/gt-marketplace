import User from "../models/User.js";

export const updateUser = async (req, res) => {
    //  let action, listingId, filteredUpdates = {};
    try {
      const userId = req.params.id
      const {updates,action,listingId } = req.body; 
      console.log('updates', updates)
      console.log('action', action)
      console.log('listingId', listingId)

      let updateQuery = {}
      if (action && listingId) {
        console.log('action', action)
        console.log('listingId', listingId)
        if (action === "add") {
          updateQuery = { $addToSet: { interestedListings: listingId } }
        } else if (action === "remove") {
          updateQuery = { $pull: { interestedListings: listingId } }
        }
        console.log('updateQuery', updateQuery)
      } else if (updates && Object.keys(updates).length > 0) {
         // Remove any fields that are undefined (not provided in the request)
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
          );
        updateQuery = { $set: filteredUpdates}
      } else {
        return res.status(400).json({ message: "No valid updates provided" });
    }

    //   console.log('filteredUpdates', filteredUpdates)
  
      // Use findByIdAndUpdate with $set to update only specified fields
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateQuery,
        { new: true }  // Option to return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ user: updatedUser });
      console.log('updatequery', updateQuery);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user profile', error, });
    }
  };
  
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id)
            .populate('listings interestedListings contacts') // Populate references
            .select('-password'); // Exclude the password field for security

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

export const getUserByEmail = async (req, res) => {
  const email  = req.params.email;

  try {
      
      const user = await User.find({ email: email })
          .populate('listings interestedListings') // Populate references
          .select('-password'); // Exclude the password field for security
     console.log("is this being hit?")
      console.log(user)
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({user: user});
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

export const addInterestedListing = async (req, res) => {
  try {
      const { userId, listingId } = req.body; // Expect userId and listingId in request body

      if (!userId || !listingId) {
          return res.status(400).json({ message: "User ID and Listing ID are required." });
      }

      // Update the user's interestedListings array
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { interestedListings: listingId } }, // $addToSet prevents duplicates
          { new: true } // Return updated document
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Listing added to interestedListings" });
  } catch (error) {
      res.status(500).json({ message: "Failed to add interested listing", error });
  }
};

export const removeInterestedListing = async (req, res) => {
  try {
      const { userId, listingId } = req.body;

      if (!userId || !listingId) {
          return res.status(400).json({ message: "User ID and Listing ID are required." });
      }

      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { interestedListings: listingId } }, // $pull removes matching value
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Listing removed from interestedListings" });
  } catch (error) {
      res.status(500).json({ message: "Failed to remove interested listing", error });
  }
};

export const getUserListings = async (req, res) => {
  try {
      const { id } = req.params;

      // Find the user and return only the listings array, populating the listing details
      const user = await User.findById(id).populate('listings', '-__v'); // Exclude __v (version) field

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ listings: user.listings });
  } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user listings", error });
  }
};

export const getUserInterestedListings = async (req, res) => {
  try {
      const { id } = req.params;

      // Find the user and return only the interestedListings array, populating listing details
      const user = await User.findById(id).populate('interestedListings', '-__v');

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ interestedListings: user.interestedListings });
  } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user's interested listings", error });
  }
};

export const addContact = async (req, res) => {
    const { user1Id, user2Id } = req.body;

    if (user1Id === user2Id) {
        return res.status(400).json({ message: "You cannot message yourself" });
    }

    try {
        await Promise.all([
            User.findByIdAndUpdate(user1Id, { $addToSet: { contacts: user2Id } }),
            User.findByIdAndUpdate(user2Id, { $addToSet: { contacts: user1Id } })
        ]);
        
        const user1 = await User.findById(user1Id);
        const user2 = await User.findById(user2Id);
        console.log('user1: ' + user1.fullName);
        console.log('user2: ' + user2.fullName);
        console.log('contacts: ' + user1.contacts);
        return res.status(200).json({ message: "Contact added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add contact", error });
    }
};