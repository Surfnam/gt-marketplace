// import User from '../models/User.js';

// export const requireAdmin = async (req, res, next) => {
//   try {
//     // Get user email from request headers or body
//     const userEmail = req.headers['user-email'] || req.body.userEmail;
    
//     if (!userEmail) {
//       return res.status(401).json({ 
//         message: 'User email is required for admin access' 
//       });
//     }

//     // Find user by email and check if they're an admin
//     const user = await User.findOne({ email: userEmail });
    
//     if (!user) {
//       return res.status(404).json({ 
//         message: 'User not found' 
//       });
//     }

//     if (user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: 'Admin access required' 
//       });
//     }

//     // Add user info to request for use in controllers
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Admin auth middleware error:', error);
//     res.status(500).json({ 
//       message: 'Error verifying admin access', 
//       error: error.message 
//     });
//   }
// };
