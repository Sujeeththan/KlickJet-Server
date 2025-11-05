import User from "../models/User.js";

// Get All Users with Pagination
export const getAllUsers = async (req, res) => {
  try {
    // Default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch paginated users
    const users = await User.find().skip(skip).limit(limit);

    // Count total users for pagination metadata
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid User ID Format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Create User
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      upsert: false,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid User ID Format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found or Already Deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID Format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to Delete User",
      error: error.message,
    });
  }
};
