import Shop from "../models/Shop.js";

// Get All Shops with Pagination
export const getAllShop = async (req, res) => {
  try {
    // Default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch paginated shops
    const shops = await Shop.find().skip(skip).limit(limit);

    // Count total shops for pagination metadata
    const totalShop = await Shop.countDocuments();

    res.status(200).json({
      success: true,
      message: "Shops fetched successfully",
      page,
      limit,
      totalShop,
      totalPages: Math.ceil(totalShop / limit),
      shops,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Shop by ID
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop Not Found" });
    }
    res.status(200).json({ shop });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Shop ID Format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Create Shop
export const createShop = async (req, res) => {
  try {
    const newShop = new Shop(req.body);
    const savedShop = await newShop.save();
    res.status(201).json({
      success: true,
      message: "Shop Created Successfully",
      shop: savedShop,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update shop
export const updateShop = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedShop = await Shop.findByIdAndUpdate(id, req.body, {
      new: true,
      upsert: false,
      runValidators: true,
    });

    if (!updateShop) {
      return res.status(404).json({ message: "Shop Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Shop Updated Successfully",
      user: updatedShop,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Shop ID Format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete Shop
export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop Not Found or Already Deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shop Deleted Successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Shop ID Format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to Delete Shop",
      error: error.message,
    });
  }
};
