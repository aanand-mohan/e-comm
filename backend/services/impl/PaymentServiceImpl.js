import Stripe from 'stripe';
import OrderRepository from '../../repositories/OrderRepository.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentServiceImpl {
    async verifyPayment(orderId, sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status === 'paid') {
                const updateData = {
                    paymentStatus: 'Paid',
                    paidAt: Date.now(),
                    paymentIntentId: session.payment_intent
                };

                await OrderRepository.update(orderId, updateData);
                return { success: true, message: 'Payment verified and order updated' };
            } else {
                return { success: false, message: 'Payment not completed yet' };
            }
        } catch (error) {
            console.error('Verify Payment Error:', error);
            throw new Error('Payment verification failed');
        }
    }

    async createCheckoutSession(orderId, cartItems) {
        if (!cartItems || cartItems.length === 0) {
            throw new Error('No items in cart');
        }

        let subTotal = 0;

        const line_items = cartItems.map((item) => {
            const itemTotal = item.product.price * item.quantity;
            subTotal += itemTotal;

            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.product.title,
                        images: item.product.images && item.product.images.length > 0 ? [item.product.images[0]] : [],
                    },
                    unit_amount: Math.round(item.product.price * 100),
                },
                quantity: item.quantity,
            };
        });

        // Add GST Line Item
        const gstAmount = Math.round(subTotal * 0.18);
        if (gstAmount > 0) {
            line_items.push({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'GST (18%)',
                        description: 'Goods and Services Tax',
                    },
                    unit_amount: Math.round(gstAmount * 100), // GST in paisa
                },
                quantity: 1,
            });
        }

        let clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

        // Auto-fix: If we are on production (Render) but CLIENT_URL is still localhost, force the Vercel URL
        if (clientUrl.includes('localhost') && (process.env.NODE_ENV === 'production' || process.env.ON_RENDER === 'true')) {
            clientUrl = 'https://e-comm-2adg.vercel.app';
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${clientUrl}/order-success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientUrl}/cart`,
            metadata: {
                orderId: orderId,
            },
        });

        return { id: session.id, url: session.url };
    }

    async handleWebhook(body, signature) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata.orderId;

            if (orderId) {
                // We use update logic. 
                // Since OrderRepository.update takes an object, we first fetch or just partial update if supported.
                // Our Repo update expects (id, updateData).
                const updateData = {
                    paymentStatus: 'Paid',
                    paidAt: Date.now(),
                    paymentIntentId: session.payment_intent
                };

                await OrderRepository.update(orderId, updateData);
                console.log(`Order ${orderId} marked as paid`);
            }
        }

        return true;
    }
}

export default new PaymentServiceImpl();
