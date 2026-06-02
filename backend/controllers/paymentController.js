import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { User } = db;
import Stripe from 'stripe';
import BaseController from './baseController.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

class PaymentController extends BaseController {
  createPaymentIntent = async (req, res) => {
    try {
      const userId = req.user.id;
      const amount = parseInt(process.env.PREMIUM_PRICE_AMOUNT || '490'); // amount in cents (default $4.90)
      const currency = process.env.PREMIUM_PRICE_CURRENCY || 'usd';

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: { userId: String(userId), purpose: 'premium_upgrade' }
      });

      return this.sendSuccess(res, 200, 'PaymentIntent dibuat', { clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('createPaymentIntent error:', error);
      return this.sendError(res, 500, error.message);
    }
  };

  // Webhook endpoint — gunakan raw body pada route
  handleWebhook = async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

      let event;
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
      } else {
        // Jika belum disetel webhook secret (dev), parse body
        event = req.body;
      }

      if (event.type === 'payment_intent.succeeded') {
        const pi = event.data.object;
        const userId = pi.metadata?.userId;
        if (userId) {
          const user = await User.findByPk(userId);
          if (user) {
            const premiumExpiresAt = new Date();
            premiumExpiresAt.setDate(premiumExpiresAt.getDate() + 30);
            await user.update({ role: 'premium', premiumExpiresAt });
            console.log(`User ${user.email} upgraded to premium until ${premiumExpiresAt}`);
          }
        }
      }

      res.status(200).send({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  };
}

export default new PaymentController();
