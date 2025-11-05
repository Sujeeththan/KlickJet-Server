import express from "express";

import {
  getAllSeller,
  getSellerById,
  createSeller,
  updateSeller,
  deleteSeller,
} from "../controllers/sellerController.js";

const sellerRouter = express.Router();

sellerRouter.get("/", getAllSeller);
sellerRouter.get("/:id", getSellerById);
sellerRouter.post("/", createSeller);
sellerRouter.put("/:id", updateSeller);
sellerRouter.delete("/:id", deleteSeller);

export default sellerRouter;
