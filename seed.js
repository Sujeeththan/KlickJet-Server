import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Customer from "./models/Customer.js";
import Seller from "./models/Seller.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Review from "./models/Review.js";

// Load environment variables
dotenv.config();

// Ensure we're in development (check NODE_ENV or default to development if not set)
const nodeEnv = process.env.NODE_ENV || "development";
if (nodeEnv === "production") {
  console.error(" Seeding is only allowed in development environment");
  console.error(" Current NODE_ENV:", nodeEnv);
  process.exit(1);
}

// Hash password helper (since we're bypassing the pre-save hook for seeding)
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Sample data
const sampleData = {
  admin: {
    name: "Admin User",
    email: "admin@klickjet.com",
    password: "Admin@123",
    role: "admin",
    isActive: true,
  },
  sellers: [
    {
      name: "John Seller",
      shopName: "John's Electronics",
      email: "john.seller@klickjet.com",
      password: "Seller@123",
      phone_no: "1234567890",
      address: "123 Main St, City, State 12345",
      status: "approved",
      isActive: true,
    },
    {
      name: "Sarah Merchant",
      shopName: "Sarah's Fashion Boutique",
      email: "sarah.seller@klickjet.com",
      password: "Seller@123",
      phone_no: "2345678901",
      address: "456 Oak Ave, City, State 12345",
      status: "approved",
      isActive: true,
    },
    {
      name: "Mike Retailer",
      shopName: "Mike's Home & Garden",
      email: "mike.seller@klickjet.com",
      password: "Seller@123",
      phone_no: "3456789012",
      address: "789 Pine Rd, City, State 12345",
      status: "approved",
      isActive: true,
    },
    {
      name: "Emma Store",
      shopName: "Emma's Books & More",
      email: "emma.seller@klickjet.com",
      password: "Seller@123",
      phone_no: "4567890123",
      address: "321 Elm St, City, State 12345",
      status: "approved",
      isActive: true,
    },
    {
      name: "David Shop",
      shopName: "David's Sports Gear",
      email: "david.seller@klickjet.com",
      password: "Seller@123",
      phone_no: "5678901234",
      address: "654 Maple Dr, City, State 12345",
      status: "approved",
      isActive: true,
    },
  ],
  customers: [
    {
      name: "Alice Customer",
      email: "alice.customer@klickjet.com",
      password: "Customer@123",
      phone_no: "1111111111",
      address: "100 Customer Lane, City, State 12345",
      isActive: true,
    },
    {
      name: "Bob Buyer",
      email: "bob.customer@klickjet.com",
      password: "Customer@123",
      phone_no: "2222222222",
      address: "200 Buyer Blvd, City, State 12345",
      isActive: true,
    },
    {
      name: "Charlie Client",
      email: "charlie.customer@klickjet.com",
      password: "Customer@123",
      phone_no: "3333333333",
      address: "300 Client Court, City, State 12345",
      isActive: true,
    },
    {
      name: "Diana Shopper",
      email: "diana.customer@klickjet.com",
      password: "Customer@123",
      phone_no: "4444444444",
      address: "400 Shopper Street, City, State 12345",
      isActive: true,
    },
    {
      name: "Eve EndUser",
      email: "eve.customer@klickjet.com",
      password: "Customer@123",
      phone_no: "5555555555",
      address: "500 End User Way, City, State 12345",
      isActive: true,
    },
  ],
  products: [
    {
      name: "Wireless Headphones",
      price: 79.99,
      instock: true,
      discount: 10,
    },
    {
      name: "Smart Watch",
      price: 199.99,
      instock: true,
      discount: 15,
    },
    {
      name: "Laptop Stand",
      price: 39.99,
      instock: true,
      discount: 5,
    },
    {
      name: "USB-C Cable",
      price: 14.99,
      instock: true,
      discount: 0,
    },
    {
      name: "Wireless Mouse",
      price: 29.99,
      instock: true,
      discount: 8,
    },
    {
      name: "Mechanical Keyboard",
      price: 129.99,
      instock: true,
      discount: 20,
    },
    {
      name: "Monitor Stand",
      price: 49.99,
      instock: true,
      discount: 12,
    },
    {
      name: "Webcam HD",
      price: 59.99,
      instock: true,
      discount: 10,
    },
    {
      name: "Desk Lamp",
      price: 34.99,
      instock: true,
      discount: 7,
    },
    {
      name: "Cable Management",
      price: 19.99,
      instock: true,
      discount: 5,
    },
  ],
};

const seedDatabase = async () => {
  try {
    console.log(" Starting database seeding...\n");

    // Connect to database
    await connectDB();
    console.log(" Connected to MongoDB\n");

    // Clear existing data
    console.log("  Clearing existing data...");
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Seller.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log(" All collections cleared\n");

    // Seed Admin User
    console.log(" Seeding Admin User...");
    const adminPassword = await hashPassword(sampleData.admin.password);
    const adminUser = await User.create({
      ...sampleData.admin,
      password: adminPassword,
    });
    console.log(
      ` Admin created: ${adminUser.email} (ID: ${adminUser._id})\n`
    );

    // Seed Sellers (Providers)
    console.log(" Seeding Sellers (Providers)...");
    const sellers = [];
    for (const sellerData of sampleData.sellers) {
      const sellerPassword = await hashPassword(sellerData.password);
      const seller = await Seller.create({
        ...sellerData,
        password: sellerPassword,
        approvedBy: adminUser._id,
        approvedAt: new Date(),
      });
      sellers.push(seller);

      // Also create User entry for seller
      await User.create({
        name: sellerData.name,
        email: sellerData.email,
        password: sellerPassword,
        role: "seller",
        isActive: true,
      });
    }
    console.log(` ${sellers.length} Sellers created\n`);

    // Seed Customers
    console.log(" Seeding Customers...");
    const customers = [];
    for (const customerData of sampleData.customers) {
      const customerPassword = await hashPassword(customerData.password);
      const customer = await Customer.create({
        ...customerData,
        password: customerPassword,
      });
      customers.push(customer);

      // Also create User entry for customer
      await User.create({
        name: customerData.name,
        email: customerData.email,
        password: customerPassword,
        role: "customer",
        isActive: true,
      });
    }
    console.log(` ${customers.length} Customers created\n`);

    // Seed Products (Items)
    console.log(" Seeding Products (Items)...");
    const products = await Product.insertMany(sampleData.products);
    console.log(` ${products.length} Products created\n`);

    // Seed Orders (Bookings)
    console.log(" Seeding Orders (Bookings)...");
    const orders = [];
    const orderStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    for (let i = 0; i < 5; i++) {
      const randomCustomer =
        customers[Math.floor(Math.random() * customers.length)];
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const basePrice =
        randomProduct.price * (1 - randomProduct.discount / 100);
      const totalAmount = basePrice * quantity;

      const order = await Order.create({
        customer_id: randomCustomer._id,
        product_id: randomProduct._id,
        quantity: quantity,
        total_amount: Math.round(totalAmount * 100) / 100,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        order_date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ), // Random date within last 30 days
      });
      orders.push(order);
    }
    console.log(` ${orders.length} Orders created\n`);

    // Seed Reviews
    console.log(" Seeding Reviews...");
    const reviews = [];
    const deliveredOrders = orders.filter(
      (order) => order.status === "delivered"
    );
    const ordersToReview =
      deliveredOrders.length > 0 ? deliveredOrders : orders.slice(0, 3);

    for (let i = 0; i < Math.min(5, ordersToReview.length); i++) {
      const order = ordersToReview[i];
      const randomCustomer =
        customers.find(
          (c) => c._id.toString() === order.customer_id.toString()
        ) || customers[0];

      const review = await Review.create({
        customer_id: randomCustomer._id,
        order_id: order._id,
        product_id: order.product_id,
        rating: Math.floor(Math.random() * 3) + 3, // Rating between 3-5
        comment: [
          "Great product! Highly recommended.",
          "Good quality and fast delivery.",
          "Excellent service, will order again.",
          "Very satisfied with the purchase.",
          "Good value for money.",
        ][Math.floor(Math.random() * 5)],
      });
      reviews.push(review);
    }
    console.log(` ${reviews.length} Reviews created\n`);

    // Summary
    console.log("═══════════════════════════════════════");
    console.log(" Database seeded successfully!");
    console.log("═══════════════════════════════════════");
    console.log(` Admin: 1`);
    console.log(` Sellers (Providers): ${sellers.length}`);
    console.log(` Customers: ${customers.length}`);
    console.log(` Products (Items): ${products.length}`);
    console.log(` Orders (Bookings): ${orders.length}`);
    console.log(` Reviews: ${reviews.length}`);
    console.log("═══════════════════════════════════════\n");

    // Close database connection
    await mongoose.connection.close();
    console.log(" Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error(" Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
