const mongoose = require('mongoose');

// תת-סכמה לפרטי מוצר בהזמנה
const itemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  quantity: Number,
  price: Number
}, { _id: false });

// תת-סכמה להזמנה
const purchaseSchema = new mongoose.Schema({
  orderId: String,
  status: String,
  createdAt: Date,
  items: [itemSchema]
}, { _id: false });

// תת-סכמה למוצר של ספק
const inventorySchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  minQty: Number
}, { _id: false });

// הסכמה הראשית של ספק
const vendorSchema = new mongoose.Schema({
  id: String,
  name: String,
  phone: String,
  email: String,
  password: String,
  company: String,
  representative: String,
  role: {
    type: String,
    enum: ['supplier', 'manager']
  },
  products: [inventorySchema],
  orders: [purchaseSchema]
}, { timestamps: true }); // מוסיף createdAt ו-updatedAt אוטומטית

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
