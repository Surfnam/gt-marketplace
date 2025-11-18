import Admin from '../models/Admin.js';

// Create a new admin
export const createAdmin = async (req, res) => {
  // Admin creation should be performed directly in the database, not via API
  return res.status(403).json({
    message: 'Admin creation via API is disabled. Please provision admins directly in the database.',
  });
};

// Read all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-moderationHistory'); // Exclude long history logs by default
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admins', error: error.message });
  }
};

// Read a single admin by ID
export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).populate('createdBy', 'name email'); // Populate createdBy to see which admin created this account
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admin', error: error.message });
  }
};

// Update an admin's details
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent critical auth fields from being changed via this endpoint
    delete updates.auth;
    delete updates.email;

    const updatedAdmin = await Admin.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json({ message: 'Admin updated successfully!', admin: updatedAdmin });
  } catch (error) {
    res.status(400).json({ message: 'Error updating admin', error: error.message });
  }
};

// Deactivate an admin (Soft Delete)
export const deactivateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    // Instead of deleting, we change their status. This preserves their history.
    const deactivatedAdmin = await Admin.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });

    if (!deactivatedAdmin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json({ message: 'Admin has been suspended.', admin: deactivatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating admin', error: error.message });
  }
};

// Add a moderation action to an admin's history
export const addModerationAction = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the admin who performed the action
    const moderationAction = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $push: { moderationHistory: moderationAction } },
      { new: true, runValidators: true }
    );

     if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json({ message: 'Moderation action logged.', admin: updatedAdmin });

  } catch (error) {
     res.status(400).json({ message: 'Error logging moderation action', error: error.message });
  }
};
