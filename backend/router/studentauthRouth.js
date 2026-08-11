import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { searchStudentsByRoll } from '../controller/StudentController.js';


const studentRouter = express.Router();

// শুধুমাত্র Admin-রা রোল নম্বর দিয়ে সার্চ করতে পারবে
studentRouter.get("/search-by-roll", authenticateToken, authorizeRoles("admin"), searchStudentsByRoll);




export default studentRouter;