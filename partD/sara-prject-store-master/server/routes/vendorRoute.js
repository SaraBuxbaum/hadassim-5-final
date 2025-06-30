const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.get('/', vendorController.fetchAllVendors); // קבלת רשימת כל הספקים
router.get('/:id', vendorController.fetchVendorDetails); // קבלת ספק לפי מזהה
router.post('/', vendorController.registerVendor); // הוספת ספק חדש
router.put('/orders/update', vendorController.modifyOrderFlow); // עדכון סטטוס או הוספת הזמנה
router.post('/login', vendorController.authenticateVendor); // התחברות ספק

module.exports = router;
