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
            .populate('listings savedListings interestedListings') // Populate references
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
          .populate('listings savedListings interestedListings') // Populate references
          .select('-password'); // Exclude the password field for security
      console.log(user)
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};