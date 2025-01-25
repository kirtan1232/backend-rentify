const path = require('path');
const productModel = require('../models/productModels');
const fs = require('fs');


// Helper function to move image and return the file name
const moveImage = async (image) => {
    const imageName = `${Date.now()}-${image.name}`;
    const imageUploadPath = path.join(__dirname, `../public/rooms/${imageName}`);
    
    try {
        // Ensure the destination directory exists
        if (!fs.existsSync(path.join(__dirname, '../public/rooms'))) {
            fs.mkdirSync(path.join(__dirname, '../public/rooms'), { recursive: true });
        }

        // Move the image to the destination folder
        await image.mv(imageUploadPath);
        return imageName;
    } catch (err) {
        throw new Error('Error moving image file');
    }
};

// Create a new product
const createProduct = async (req, res) => {
    const {
        roomDescription,   
        floor,
        address,
        rentPrice,
        parking,
        contactNo,
        bathroom,
    } = req.body;

    // Validate required fields
    if (!roomDescription || !floor || !address || !rentPrice || !parking || !contactNo || !bathroom) {
        return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    // Check if room image is provided
    if (!req.files || !req.files.roomImage) {
        return res.status(400).json({ success: false, message: "Room image is required" });
    }

    try {
        const imageName = await moveImage(req.files.roomImage);

        const newProduct = new productModel({
            roomDescription,
            floor,
            address,
            rentPrice,
            parking,
            contactNo,
            bathroom,
            roomImage: imageName
        });

        const product = await newProduct.save();
        res.status(201).json({ success: true, message: "Product Created Successfully!", data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Fetch all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ success: true, message: "Products fetched successfully!", products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Fetch a single product


const getProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching product details", error: error.message });
    }
};



// Delete a product and its associated image
const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productModel.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete the image file from the server
        const oldImagePath = path.join(__dirname, `../public/rooms/${product.roomImage}`);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        res.status(200).json({ success: true, message: "Product Deleted Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        let imageName;

        // Check if a new image is provided
        if (req.files && req.files.roomImage) {
            const { roomImage } = req.files;
            imageName = await moveImage(roomImage);

            // Remove old image from the server if it exists
            const existingProduct = await productModel.findById(req.params.id);
            if (existingProduct.roomImage) {
                const oldImagePath = path.join(__dirname, `../public/rooms/${existingProduct.roomImage}`);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        } else {
            // If no new image is uploaded, keep the existing image
            const existingProduct = await productModel.findById(req.params.id);
            imageName = existingProduct.roomImage;
        }

        // Update the product, including the roomImage if a new one is provided
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, roomImage: imageName },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Product Updated Successfully!", updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Search products by room description
const searchProducts = async (req, res) => {
    const searchQuery = req.query.q;

    try {
        const products = await productModel.find({
            roomDescription: { $regex: searchQuery, $options: 'i' }
        });

        res.status(200).json({
            success: true,
            message: "Search results fetched successfully!",
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    searchProducts
};
