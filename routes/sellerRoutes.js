import express from "express";
import {
  getAllSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
} from "../controllers/sellerController.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/roleMiddleware.js";

const sellerRouter = express.Router();

// All seller routes require authentication
sellerRouter.get("/", verifyToken, verifyRole(["admin", "seller"]), getAllSellers);
sellerRouter.get("/:id", verifyToken, verifyRole(["admin", "seller"]), getSellerById);
sellerRouter.put("/:id", verifyToken, verifyRole(["admin", "seller"]), updateSeller);
sellerRouter.delete("/:id", verifyToken, verifyRole("admin"), deleteSeller);

export default sellerRouter;
