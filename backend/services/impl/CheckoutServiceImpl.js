import UserRepository from '../../repositories/UserRepository.js';
import ProductRepository from '../../repositories/ProductRepository.js';
import OrderRepository from '../../repositories/OrderRepository.js';

class CheckoutServiceImpl {
    async checkout(userId, shippingAddress, paymentMethod) {
        const user = await UserRepository.findById(userId);
        // Need to populate to check prices/stock
        await user.populate('cart.product');

        if (!user.cart || user.cart.length === 0) {
            throw new Error('Cart is empty');
        }

        let orderItems = [];
        let totalPrice = 0;

        for (const item of user.cart) {
            // Using ProductRepo to ensure we get fresh data
            const product = await ProductRepository.findById(item.product._id);

            if (!product) {
                throw new Error(`Product not found: ${item.product._id}`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}`);
            }

            orderItems.push({
                product: product._id,
                title: product.title,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0] || '',
                productId: product._id
            });

            totalPrice += product.price * item.quantity;

            // Stock deduction could happen here
        }

        const orderData = {
            user: userId,
            products: orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
            totalAmount: totalPrice,
        };

        const createdOrder = await OrderRepository.create(orderData);

        // Clear cart
        user.cart = [];
        await UserRepository.save(user);

        return createdOrder;
    }
}

export default new CheckoutServiceImpl();
