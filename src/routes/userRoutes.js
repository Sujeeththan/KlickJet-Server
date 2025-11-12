import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/roleMiddleware.js";

const userRouter = express.Router();

// All routes require admin authentication
userRouter.get("/", verifyToken, verifyRole("admin"), getAllUsers);
userRouter.get("/:id", verifyToken, verifyRole("admin"), getUserById);
userRouter.post("/", verifyToken, verifyRole("admin"), createUser);
userRouter.put("/:id", verifyToken, verifyRole("admin"), updateUser);
userRouter.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);

export default userRouter;

