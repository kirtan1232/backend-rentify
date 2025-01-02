const router = require('express').Router();
const productControllers = require('../controllers/productController');
const { authGuard, adminGuard } = require('../middleware/authGuard');

// Create product route
// POST http://localhost:5000/api/product/create
router.post('/create', productControllers.createProduct);

// Fetch all products route
// GET http://localhost:5000/api/product/get_all_products
router.get('/get_all_products', productControllers.getAllProducts);

// Fetch a single product by ID
// GET http://localhost:5000/api/product/get_single_product/:id
// Only authenticated users can fetch details
router.get('/get_single_product/:id', authGuard, productControllers.getProduct);

// Delete product route
// DELETE http://localhost:5000/api/product/delete_product/:id
// Only admin users can delete products
router.delete('/delete_product/:id', adminGuard, productControllers.deleteProduct);

// Update product route
// PUT http://localhost:5000/api/product/update_product/:id
// Only admin users can update products
router.put('/update_product/:id', adminGuard, productControllers.updateProduct);

// Search products by name
// GET http://localhost:5000/api/product/search?q=searchQuery
router.get('/search', productControllers.searchProducts);

// Exporting the router to be used in app.js
module.exports = router;
