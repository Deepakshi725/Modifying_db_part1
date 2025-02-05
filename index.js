const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

// Routes

// POST /menu - Add new menu item
app.post("/menu", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const newItem = new MenuItem({ name, description, price });
    await newItem.save();
    res.status(201).json({ message: "Menu item added", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /menu - Fetch all menu items
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
