import Product from "../models/Product.js";

export const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      message: "Product fetched successfully",
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      filter,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    if (!savedProduct) {
      return res.status(400).json({ message: "Product not created" });
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product by ID
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product already deleted or not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID format",
      });
    }
    res.status(500).json({
      error: "Failed to delete product",
    });
  }
};
