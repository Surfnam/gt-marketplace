import mongoose from 'mongoose';

// Sub-schema tracks moderation actions taken by an admin.
const moderationActionSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['suspend_user', 'remove_listing', 'warn_user', 'resolve_report'],
  },
  targetId: { // The ID of the user or listing that was moderated (**Might change user and listing schema as well**)
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  actionDate: {
    type: Date,
    default: Date.now,
  },
});

const adminSchema = new mongoose.Schema(
  {
    // Identity
    email: {
      type: String,
      required: [true, 'Admin email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'], // Ensures the email format is valid
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // Authentication
    auth: {
      provider: {
        type: String,
        required: true,
        enum: ['firebase', 'sso', 'password'],
      },
      uid: { // The unique ID from Firebase or SSO provider
        type: String,
        required: true,
        unique: true,
      },
    },

    // Admin access
    role: {
      type: String,
      required: true,
      enum: ['superadmin', 'moderator', 'support'], // (**Can be changed later**)
      default: 'support',
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'suspended', 'invited'],
      default: 'invited',
    },
    permissions: {
      type: [String],
      enum: [ // (**This enum list can be expanded**)
        'items.read', 'items.write', 'items.moderate',
        'users.read', 'users.write',
        'admins.read', 'admins.write',
        'reports.read', 'reports.write',
      ],
      default: [],
    },

    // Security
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
    
    // Auditing history
    moderationHistory: [moderationActionSchema], // This is an array of actions this admin has taken.

    notes: {
      type: String,
      trim: true,
    },
    createdBy: { // Reference to the admin who created this account
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema, 'admins');

export default Admin;