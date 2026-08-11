import express from "express";
import {
  issueManualBooks,
  getIssues,
  getStudentIssues,
  returnBook,
  applyFine,
  clearFine,
  getFineSettings,
  updateFineSettings,
} from "../controller/bookController.js";


import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Issue manual books (Admin only)
router.post("/issue-manual", authenticateToken, authorizeRoles("admin"), issueManualBooks);

// 2. Get all manual issues (Admin only)
router.get("/all-manual-issues", authenticateToken, authorizeRoles("admin"), getIssues);

// 3. Get manual issues for logged-in student
router.get("/student-manual-issues", authenticateToken, getStudentIssues);

// 4. Return issued manual book (Admin only)
router.put("/return/:id", authenticateToken, authorizeRoles("admin"), returnBook);

// 5. Apply manual fine (Admin only)
router.put("/apply-fine/:id", authenticateToken, authorizeRoles("admin"), applyFine);

// 6. Clear manual fine (Admin only)
router.put("/clear-fine/:id", authenticateToken, authorizeRoles("admin"), clearFine);

// 7. Get Active fine settings
router.get("/fine-settings", authenticateToken, getFineSettings);

// 8. Update fine settings (Admin only)
router.put("/fine-settings", authenticateToken, authorizeRoles("admin"), updateFineSettings);

export default router;