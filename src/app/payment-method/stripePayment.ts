import envConfig from '../config/env.config';
import { IPaymentMethodData } from './interface';

const stripe = require('stripe')(envConfig.stripe.secret);

export const stripePayment = async (data: IPaymentMethodData) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: data.currency,
          product_data: {
            name: data.service_name,
          },
          unit_amount: Math.round(data.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
  });

  return session.url;
};
