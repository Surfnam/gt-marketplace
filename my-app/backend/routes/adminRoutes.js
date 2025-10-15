import express from 'express';
import { 
  createAdmin, 
  getAllAdmins, 
  getAdminById, 
  updateAdmin, 
  deactivateAdmin,
  addModerationAction
} from '../controllers/adminController.js';

const router = express.Router();

// Route for getting all admins and creating a new admin
router.route('/')
  .get(getAllAdmins)
  .post(createAdmin);

// Routes for getting, updating, and deactivating a specific admin
router.route('/:id')
  .get(getAdminById)
  .patch(updateAdmin)       // Use Patch for partial updates
  .delete(deactivateAdmin); // Use Delete for deactivation (soft delete)

// Route for adding a moderation action to an admin's history
router.route('/:id/moderation')
  .post(addModerationAction);

export default router;