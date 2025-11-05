import express from "express";

import {
  getAllDeliverer,
  getDelivererById,
  createDeliverer,
  updateDeliverer,
  deleteDeliverer,
} from "../controllers/delivererController.js";

const delivererRouter = express.Router();

delivererRouter.get("/", getAllDeliverer);
delivererRouter.get("/:id", getDelivererById);
delivererRouter.post("/", createDeliverer);
delivererRouter.put("/:id", updateDeliverer);
delivererRouter.delete("/:id", deleteDeliverer);

export default delivererRouter;
