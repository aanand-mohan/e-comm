import ProductServiceImpl from '../services/impl/ProductServiceImpl.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? req.query.keyword : '';
        const category = req.query.category ? req.query.category : '';
        const products = await ProductServiceImpl.getProducts(keyword, category);
        res.json(products);
    } catch (error) {
        res.status(500); // Internal Server Error
        throw new Error(error.message);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await ProductServiceImpl.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        let productData = { ...req.body };

        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map(file => file.path); // Cloudinary returns 'path' as the secure URL
        }

        const product = await ProductServiceImpl.createProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        let productData = { ...req.body };

        // Handle uploaded images (append or replace? usually replace or special logic, here we just check if new files exist)
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map(file => file.path);
        }

        const product = await ProductServiceImpl.updateProduct(req.params.id, productData);
        res.json(product);
    } catch (error) {
        res.status(404); // Or 400 depending on error
        throw new Error(error.message);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const result = await ProductServiceImpl.deleteProduct(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
};

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
