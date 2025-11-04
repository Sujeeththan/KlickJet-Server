import DeliveryPerson from "../models/DeliveryPerson.js";

//  Get All Delivery Persons with Pagination
export const getAllDeliveryPerson = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const deliveryPersons = await DeliveryPerson.find().skip(skip).limit(limit);
    const totalDeliveryPersons = await DeliveryPerson.countDocuments();

    res.status(200).json({
      success: true,
      message: "Delivery persons fetched successfully",
      page,
      limit,
      totalDeliveryPersons,
      totalPages: Math.ceil(totalDeliveryPersons / limit),
      deliveryPersons,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Get Delivery Person by ID
export const getDeliveryPersonById = async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findById(req.params.id);
    if (!deliveryPerson) {
      return res.status(404).json({ success: false, message: "Delivery person not found" });
    }
    res.status(200).json({ success: true, deliveryPerson });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid Delivery Person ID Format" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Create Delivery Person
export const createDeliveryPerson = async (req, res) => {
  try {
    const newDeliveryPerson = new DeliveryPerson(req.body);
    const savedDeliveryPerson = await newDeliveryPerson.save();

    res.status(201).json({
      success: true,
      message: "Delivery person created successfully",
      deliveryPerson: savedDeliveryPerson,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Update Delivery Person
export const updateDeliveryPerson = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDeliveryPerson) {
      return res.status(404).json({ success: false, message: "Delivery person not found" });
    }

    res.status(200).json({
      success: true,
      message: "Delivery person updated successfully",
      deliveryPerson: updatedDeliveryPerson,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid Delivery Person ID Format" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Delete Delivery Person
export const deleteDeliveryPerson = async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findByIdAndDelete(req.params.id);

    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery person deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Delivery Person ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete delivery person",
      error: error.message,
    });
  }
};
