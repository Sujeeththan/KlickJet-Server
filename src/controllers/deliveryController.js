import Delivery from "../models/Delivery.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Deliverer from "../models/Deliverer.js";
import { AppError } from "../middleware/errorHandler.js";
import { catchAsync } from "../middleware/errorHandler.js";

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Private/Admin, Seller, Customer, or Deliverer
export const getAllDeliveries = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  // Customers can only see deliveries for their orders
  if (req.user.role === "customer") {
    const customerOrders = await Order.find({ customer_id: req.user.id }).select("_id");
    const orderIds = customerOrders.map((o) => o._id);
    filter.order_id = { $in: orderIds };
  }

  // Sellers can see deliveries for orders of their products
  if (req.user.role === "seller") {
    const sellerProducts = await Product.find({ seller_id: req.user.id }).select("_id");
    const productIds = sellerProducts.map((p) => p._id);
    const sellerOrders = await Order.find({ product_id: { $in: productIds } }).select("_id");
    const orderIds = sellerOrders.map((o) => o._id);
    filter.order_id = { $in: orderIds };
  }

  // Deliverers can only see their own deliveries
  if (req.user.role === "deliverer") {
    filter.deliverer_id = req.user.id;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.deliverer_id) {
    filter.deliverer_id = req.query.deliverer_id;
  }

  if (req.query.order_id) {
    filter.order_id = req.query.order_id;
  }

  const deliveries = await Delivery.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("order_id", "total_amount status")
    .populate("deliverer_id", "name phone_no")
    .sort({ createdAt: -1 });

  const totalDeliveries = await Delivery.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: "Deliveries fetched successfully",
    page,
    limit,
    totalDeliveries,
    totalPages: Math.ceil(totalDeliveries / limit),
    deliveries,
  });
});

// @desc    Get delivery by ID
// @route   GET /api/deliveries/:id
// @access  Private/Admin, Seller, Customer, or Deliverer
export const getDeliveryById = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id)
    .populate("order_id")
    .populate("deliverer_id", "name phone_no");

  if (!delivery) {
    return next(new AppError("Delivery not found", 404));
  }

  // Customers can only view deliveries for their own orders
  if (req.user.role === "customer") {
    const order = await Order.findById(delivery.order_id);
    if (!order || order.customer_id.toString() !== req.user.id) {
      return next(new AppError("Not authorized to access this delivery", 403));
    }
  }

  // Sellers can only view deliveries for orders of their products
  if (req.user.role === "seller") {
    const order = await Order.findById(delivery.order_id);
    if (order) {
      const product = await Product.findById(order.product_id);
      if (!product || product.seller_id?.toString() !== req.user.id) {
        return next(new AppError("Not authorized to access this delivery", 403));
      }
    }
  }

  // Deliverers can only view their own deliveries
  if (req.user.role === "deliverer" && delivery.deliverer_id?.toString() !== req.user.id) {
    return next(new AppError("Not authorized to access this delivery", 403));
  }

  res.status(200).json({
    success: true,
    delivery,
  });
});

// @desc    Create delivery
// @route   POST /api/deliveries
// @access  Private/Admin
export const createDelivery = catchAsync(async (req, res, next) => {
  const { address, order_id, deliverer_id, status } = req.body;

  // Validation - show first error only
  if (!address) {
    return next(new AppError("Address is required", 400));
  }
  if (!order_id) {
    return next(new AppError("Order ID is required", 400));
  }

  // Check if order exists
  const order = await Order.findById(order_id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if deliverer exists (if provided)
  if (deliverer_id) {
    const deliverer = await Deliverer.findById(deliverer_id);
    if (!deliverer) {
      return next(new AppError("Deliverer not found", 404));
    }
  }

  const delivery = await Delivery.create({
    address: address.trim(),
    order_id,
    deliverer_id: deliverer_id || null,
    status: status || "pending",
  });

  const populatedDelivery = await Delivery.findById(delivery._id)
    .populate("order_id", "total_amount status")
    .populate("deliverer_id", "name phone_no");

  res.status(201).json({
    success: true,
    message: "Delivery created successfully",
    delivery: populatedDelivery,
  });
});

// @desc    Update delivery
// @route   PUT /api/deliveries/:id
// @access  Private/Admin or Deliverer
export const updateDelivery = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const delivery = await Delivery.findById(id);
  if (!delivery) {
    return next(new AppError("Delivery not found", 404));
  }

  // Deliverers can only update status and delivered_date
  if (req.user.role === "deliverer") {
    if (delivery.deliverer_id?.toString() !== req.user.id) {
      return next(new AppError("Not authorized to update this delivery", 403));
    }
    
    const updateData = {
      status: req.body.status,
      delivered_date: req.body.status === "delivered" ? new Date() : delivery.delivered_date,
    };

    const updatedDelivery = await Delivery.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("order_id", "total_amount status")
      .populate("deliverer_id", "name phone_no");

    return res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      delivery: updatedDelivery,
    });
  }

  // Admins can update all fields
  const updatedDelivery = await Delivery.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("order_id", "total_amount status")
    .populate("deliverer_id", "name phone_no");

  res.status(200).json({
    success: true,
    message: "Delivery updated successfully",
    delivery: updatedDelivery,
  });
});

// @desc    Delete delivery
// @route   DELETE /api/deliveries/:id
// @access  Private/Admin
export const deleteDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findByIdAndDelete(req.params.id);

  if (!delivery) {
    return next(new AppError("Delivery not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Delivery deleted successfully",
  });
});


