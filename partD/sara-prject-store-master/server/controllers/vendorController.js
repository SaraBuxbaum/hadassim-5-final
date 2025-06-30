const Vendor = require('../models/Vendor');

// קבלת רשימת כל הספקים
const fetchAllVendors = async (req, res) => {
  try {
    const vendorList = await Vendor.find().lean();
    res.json(vendorList);
  } catch (error) {
    console.error(error);
    res.status(500).send('שגיאה בשרת');
  }
};

// קבלת ספק לפי מזהה
const fetchVendorDetails = async (req, res) => {
  try {
    const vendorData = await Vendor.findById(req.params.id).populate('orders').lean();
    if (!vendorData) {
      return res.status(404).json({ message: 'ספק לא נמצא' });
    }
    res.json(vendorData);
  } catch (error) {
    console.error(error);
    res.status(500).send('שגיאה בשרת');
  }
};

// יצירת ספק חדש
const registerVendor = async (req, res) => {
  try {
    const {
      id, name, phone, email, company,
      representative, role, password, products, orders
    } = req.body;

    const vendorInstance = new Vendor({
      id,
      name,
      password,
      phone,
      email,
      company,
      representative,
      role,
      products,
      orders,
    });

    await vendorInstance.save();
    res.json(vendorInstance);
  } catch (error) {
    console.error(error);
    res.status(500).send('שגיאה בשרת');
  }
};

// עדכון סטטוס הזמנה או הוספת הזמנה חדשה
const modifyOrderFlow = async (req, res) => {
  const { supplierId, newOrder, updatedOrder, index } = req.body;

  try {
    const vendor = await Vendor.findById(supplierId);
    if (!vendor) return res.status(404).json({ message: 'ספק לא נמצא' });

    if (updatedOrder != null) {
      vendor.orders[index].status = "ההזמנה אושרה";
    } else {
      vendor.orders.push(newOrder);
    }

    await vendor.save();

    res.json({ message: 'ההזמנה עודכנה בהצלחה', vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
};

// התחברות ספק למערכת
const authenticateVendor = async (req, res) => {
  const { name, password } = req.body;
  console.log("Attempting to authenticate vendor:", name, password);
  try {
    const foundVendor = await Vendor.findOne({ name, password });
    console.log("Found vendor:", foundVendor);
    if (!foundVendor) {
      console.log("Authentication failed for vendor:", name);
      return res.status(401).json({ message: 'שם משתמש או סיסמה אינם נכונים' });
    }

    res.json({ id: foundVendor._id, name: foundVendor.name, role: foundVendor.role });
  } catch (error) {
    console.error(error);
    res.status(500).send('שגיאת שרת');
  }
};

module.exports = {
  fetchAllVendors,
  fetchVendorDetails,
  registerVendor,
  modifyOrderFlow,
  authenticateVendor
};
