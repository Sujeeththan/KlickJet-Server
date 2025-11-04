import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  sku: {
    type: String,
    unique: true,
    trim: true,
  },

  description: {
    type: String,
    default: null,
    trim: true,
  },

  price: {
    type: Number,
    Request: true,
    min: 0,
  },

  stock: {
    type: Number,
    default: 0,
    min: 0,
  },

  category: {
    type: String,
    default: null,
    trim: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
},
{
    timestamps: false,
    versionKey: false,
});

export default mongoose.model("Item", itemSchema);
