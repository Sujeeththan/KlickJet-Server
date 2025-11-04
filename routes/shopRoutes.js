import express from "express";

import {
  getAllShop,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
} from "../controllers/shopController.js";

const shopRouter = express.Router();

authRouter.get("/", getAllShop);
authRouter.get("/:id", getShopById);
authRouter.post("/", createShop);
authRouter.put("/:id", updateShop);
authRouter.delete("/:id", deleteShop);

export default shopRouter;
