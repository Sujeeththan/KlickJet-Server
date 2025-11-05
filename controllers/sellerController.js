import Seller from "../models/Seller.js";

// Get All Seller with Pagination
export const getAllSeller = async (req, res) => {
  try {
    // Default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch paginated seller
    const seller = await Seller.find().skip(skip).limit(limit);

    // Count total seller for pagination metadata
    const totalSeller = await Seller.countDocuments();

    res.status(200).json({
      success: true,
      message: "Seller fetched successfully",
      page,
      limit,
      totalSeller,
      totalPages: Math.ceil(totalSeller / limit),
      seller,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Seller by ID
export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller Not Found" });
    }
    res.status(200).json({ seller });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Seller ID Format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Create Seller
export const createSeller = async (req, res) => {
  try {
    const newSeller = new Seller(req.body);
    const savedSeller = await newSeller.save();
    res.status(201).json({
      success: true,
      message: "Seller Created Successfully",
      seller: savedSeller,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update seller
export const updateSeller = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedSeller = await Seller.findByIdAndUpdate(id, req.body, {
      new: true,
      upsert: false,
      runValidators: true,
    });

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Seller Updated Successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Seller ID Format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete Seller
export const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller Not Found or Already Deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Seller Deleted Successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Seller ID Format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to Delete Seller",
      error: error.message,
    });
  }
};
