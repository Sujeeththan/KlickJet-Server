import express from "express";
import connectDB from "./config/db.js";
import customerRouter from "./routes/customerRoutes.js";
import deliveryRouter from "./routes/deliveryRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";
import delivererRouter from "./routes/delivererRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import productRouter from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const allowedOrigins = [];

const app = express();
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => {
  res.send("My project final project system working");
});

const PORT = process.env.PORT;

connectDB();

// Authentication routes
app.use("/api/auth", authRouter);

// Other routes
app.use("/api/customers", customerRouter);
app.use("/api/users", userRouter);
app.use("/api/deliverer", delivererRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/order", orderRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/product", productRouter);

// 404 Handler - must be after all routes
app.use(notFound);

// Global Error Handler - must be last
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server is running in http://localhost:${PORT}`)
);
