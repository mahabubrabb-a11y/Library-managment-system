import express from 'express';
import { 
  completeProfile, 
  getProfile, 
  getUsers, 
  loginUser, 
  registerAdmin, 
  registerUser, 
  updateProfile, 
  verifyOtp 
} from '../controller/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/register', registerUser);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/complete-profile", completeProfile);

authRouter.post("/login", loginUser);
authRouter.post("/register-admin", registerAdmin);

// Protected routes
authRouter.get("/me", authenticateToken, getProfile);
authRouter.put("/update-profile", authenticateToken, updateProfile);

authRouter.get("/users", authenticateToken, authorizeRoles("admin"), getUsers);

export default authRouter; 