import express from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { verifyToken, optionalAuth } from "../middleware/auth.js";
import { verifyRole } from "../middleware/roleMiddleware.js";

const reviewRouter = express.Router();

// Public routes - anyone can view reviews
reviewRouter.get("/", optionalAuth, getAllReviews);
reviewRouter.get("/:id", optionalAuth, getReviewById);

// Protected routes - customers can create/update/delete their reviews
reviewRouter.post("/", verifyToken, verifyRole("customer"), createReview);
reviewRouter.put("/:id", verifyToken, verifyRole("customer"), updateReview);
reviewRouter.delete("/:id", verifyToken, verifyRole("customer"), deleteReview);

export default reviewRouter;
