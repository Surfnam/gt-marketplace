import User from "../models/User.js";

export const updateProfilePicture = async (req, res) => {
    const id = req.params.id;
    const { profilePicture } = req.body; // Get the profile picture URL from the request body

    if (!profilePicture) {
        return res.status(400).json({ message: 'Profile picture URL is required' });
    }

    try {
        // Update the user's profile picture in the database
        const user = await User.findByIdAndUpdate(id, { profilePicture }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile picture updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile picture', error: error.message });
    }
}

