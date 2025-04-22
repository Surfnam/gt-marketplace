import User from "../models/User.js";

export const updateUser = async (req, res) => {
    try {
      const userId = req.params.id; 
      const updates = req.body; 
      
      // Remove any fields that are undefined (not provided in the request)
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      console.log('filteredUpdates', filteredUpdates)
  
      // Use findByIdAndUpdate with $set to update only specified fields
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: filteredUpdates },
        { new: true }  // Option to return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user profile', error });
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

<<<<<<< HEAD
=======
export const getUserByIdPaginated = async (req, res) => {
    const { id } = req.params;
    let { activePage = 1, interestedPage = 1, inactivePage = 1} = req.query;
    activePage = parseInt(activePage);
    interestedPage = parseInt(interestedPage);
    inactivePage = parseInt(inactivePage)

    try {
        const user = await User.findById(id)
            .select("fullName username email bio interestedListings profilePicture") 
            .lean(); // Convert Mongoose object to JSON

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch paginated active listings
        const [activeListings, totalActiveListings] = await Promise.all([
            Listing.find({ seller: id, status: "available" })
                .sort({ createdAt: -1 }) 
                .skip((activePage-1) * MAX_USER_LISTINGS_PER_PAGE)
                .limit(MAX_USER_LISTINGS_PER_PAGE)
                .select("title price image category createdAt"),
            Listing.countDocuments({ seller: id, status: "available" })
        ]);

        // Fetch paginated interested listings
        const [interestedListings, totalInterestedListings] = await Promise.all([
            Listing.find({ _id: { $in: user.interestedListings } })
                .sort({ createdAt: -1 }) 
                .skip((interestedPage-1) * MAX_USER_LISTINGS_PER_PAGE)
                .limit(MAX_USER_LISTINGS_PER_PAGE)
                .select("title price image category createdAt"),
            Listing.countDocuments({ _id: { $in: user.interestedListings } })
        ]);

         // Fetch paginated inactive listings
         const [inactiveListings, totalInactiveListings] = await Promise.all([
            Listing.find({ seller: id, status: { $ne: "available" } }) // Exclude active listings
                .sort({ createdAt: -1 })
                .skip((inactivePage - 1) * MAX_USER_LISTINGS_PER_PAGE)
                .limit(MAX_USER_LISTINGS_PER_PAGE)
                .select("title price image category createdAt status"),
            Listing.countDocuments({ seller: id, status: { $ne: "available" } })
        ]);

        res.status(200).json({
            ...user, // Include user details
            activeListings,
            totalActiveListingsPages: Math.ceil(totalActiveListings / MAX_USER_LISTINGS_PER_PAGE),
            interestedListings,
            totalInterestedListingsPages: Math.ceil(totalInterestedListings / MAX_USER_LISTINGS_PER_PAGE),
            inactiveListings,
            totalInactiveListings: Math.ceil(totalInactiveListings / MAX_USER_LISTINGS_PER_PAGE )
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

>>>>>>> 4b910a9c236770c4fffde443b79a40bf1d127c31
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
        const userA = await User.findById(user1Id);
        const userB = await User.findById(user2Id);

        const user1HasContact = userA.contacts.some(contact => contact.user.toString() === user2Id);
        const user2HasContact = userB.contacts.some(contact => contact.user.toString() === user1Id);

        if (user1HasContact || user2HasContact) {
            return res.status(400).json({ message: "This contact already exists." });
        }

        await Promise.all([
            User.findByIdAndUpdate(user1Id, { 
                $addToSet: { contacts: { user: user2Id, lastMessage: "" } }
            }),
            User.findByIdAndUpdate(user2Id, { 
                $addToSet: { contacts: { user: user1Id, lastMessage: "" } }
            })
        ]);
        
        const user1 = await User.findById(user1Id);
        const user2 = await User.findById(user2Id);
        return res.status(200).json({ message: "Contact added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add contact", error });
    }
};

export const updateLastMessage = async (req, res) => {
    const { user1Email, user2Email, messageContent } = req.body;

    try {
        // Look up users by email addresses
        const user1 = await User.findOne({ email: user1Email });
        const user2 = await User.findOne({ email: user2Email });

        if (!user1 || !user2) {
            return res.status(404).json({ message: 'User(s) not found' });
        }

        // Now update both users' contacts array with the last message
        await Promise.all([
            User.findByIdAndUpdate(user1._id, {
                $set: { "contacts.$[elem].lastMessage": messageContent }
            }, { 
                arrayFilters: [{ "elem.user": user2._id }],
                new: true
            }),

            User.findByIdAndUpdate(user2._id, {
                $set: { "contacts.$[elem].lastMessage": messageContent }
            }, { 
                arrayFilters: [{ "elem.user": user1._id }],
                new: true
            })
        ]);

        res.status(200).json({ message: 'Last message updated successfully' });
    } catch (error) {
        console.error('Error updating last message:', error);
        res.status(500).json({ message: 'Failed to update last message', error });
    }
};