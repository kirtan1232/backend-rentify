const router = require('express').Router();
const productControllers = require('../controllers/productController');
const { authGuard, adminGuard } = require('../middleware/authGuard');

// Create product route

router.post('/create', productControllers.createProduct);

// Fetch all products route

router.get('/get_all_products', productControllers.getAllProducts);

// Fetch a single product by ID

// Only authenticated users can fetch details
router.get('/get_single_product/:id', authGuard, productControllers.getProduct);

// Delete product route

// Only admin users can delete products
router.delete('/delete_product/:id', adminGuard, productControllers.deleteProduct);

// Update product route

router.put('/update_product/:id', adminGuard, productControllers.updateProduct);

// Search products by name

router.get('/search', productControllers.searchProducts);

// Exporting the router to be used in app.js
module.exports = router;
