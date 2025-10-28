// scirpt for making admin to use for dev?
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function makeUserAdmin(identifier) {
    try {
        // Connect to MongoDB - try both environment variable names
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ No MongoDB URI found in environment variables');
            console.log('Please set MONGO_URI or MONGODB_URI in your .env file');
            return;
        }
        
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Try to find user by ID first, then by email
        let user;
        if (identifier.includes('@')) {
            // It's an email
            user = await User.findOneAndUpdate(
                { email: identifier },
                { role: 'admin' },
                { new: true }
            );
        } else {
            // It's a user ID
            user = await User.findByIdAndUpdate(
                identifier,
                { role: 'admin' },
                { new: true }
            );
        }

        if (!user) {
            console.log('❌ User not found with identifier:', identifier);
            return;
        }

        console.log('✅ Successfully made user admin:');
        console.log('Name:', user.fullName || 'N/A');
        console.log('Email:', user.email || 'N/A');
        console.log('Role:', user.role);
        console.log('User ID:', user._id);

    } catch (error) {
        console.error('❌ Error making user admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Get identifier from command line arguments
const identifier = process.argv[2];

if (!identifier) {
    console.log('Usage: node makeAdmin.js <userId_or_email>');
    console.log('Examples:');
    console.log('  node makeAdmin.js 507f1f77bcf86cd799439011');
    console.log('  node makeAdmin.js your-email@example.com');
    process.exit(1);
}

makeUserAdmin(identifier);