import envConfig from '../config/env.config';
import { IPaymentMethodData } from './interface';
const SSL = require('sslcommerz-lts');

export const sslcommerzPayment = async (data: IPaymentMethodData) => {
  const store_id = envConfig.ssl.store_id;
  const store_passwd = envConfig.ssl.store_password;
  const is_live = false; //true for live, false for sandbox
  const paymentData = {
    total_amount: data.amount,
    currency: 'USD',
    tran_id: data.transactionId, // use unique tran_id for each api call
    success_url: data.successUrl,
    fail_url: 'http://localhost:3030/fail',
    cancel_url: data.cancelUrl,
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'N/A',
    product_name: data.service_name,
    product_category: 'N/A',
    product_profile: 'general',
    cus_name: 'N/A',
    cus_email: 'N/A',
    cus_add1: 'N/A',
    cus_add2: 'N/A',
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: 'N/A',
    cus_country: 'N/A',
    cus_phone: 'N/A',
    cus_fax: 'N/A',
    ship_name: 'N/A',
    ship_add1: 'N/A',
    ship_add2: 'N/A',
    ship_city: 'N/A',
    ship_state: 'N/A',
    ship_postcode: 0,
    ship_country: 'N/A',
  };
  const sslcz = new SSL(store_id, store_passwd, is_live);
  const sslResponse = await sslcz.init(paymentData);
  let GatewayPageURL = sslResponse.GatewayPageURL;
  return GatewayPageURL;
};
