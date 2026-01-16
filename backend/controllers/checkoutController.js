import CheckoutServiceImpl from '../services/impl/CheckoutServiceImpl.js';

// @desc    Create order from cart
// @route   POST /api/checkout
// @access  Private
const checkout = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const order = await CheckoutServiceImpl.checkout(req.user._id, shippingAddress, paymentMethod);
        res.status(201).json(order);
    } catch (error) {
        const statusCode = error.message.includes('Cart is empty') || error.message.includes('Insufficient stock') ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

export { checkout };
