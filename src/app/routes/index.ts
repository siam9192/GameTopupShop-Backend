import { IRouter, Router } from 'express';
import authRouter from '../modules/auth/auth.route';
import customerRouter from '../modules/customer/customer.route';
import administratorRouter from '../modules/administrator/administrator.route';
import walletRouter from '../modules/wallet/wallet.route';
import walletSubmissionRouter from '../modules/wallet-submission/wallet-submission.route';
import manualPaymentMethodRouter from '../modules/manual-payment-method/manual-payment-method.route';
import bannerRouter from '../modules/banner/banner.route';
import transactionRouter from '../modules/transaction/transaction.route';
import offerRouter from '../modules/offer/offer.route';
import topupRouter from '../modules/topup/topup.route';
import walletHistoryRouter from '../modules/wallet-history/wallet-history.route';
import orderRouter from '../modules/order/order.route';
import notificationRouter from '../modules/notification/notification.route';
import currencyRouter from '../modules/currency/curremcy.route';
import userRouter from '../modules/user/user.route';
import appSettingRouter from '../modules/app-setting/app-setting.route';
import metadataRouter from '../modules/metadata/metadata.router';
import statisticsRouter from '../modules/statistics/statistics.route';

type TModuleRoutes = { path: string; router: IRouter }[];
const router = Router();
const moduleRoutes: TModuleRoutes = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/users',
    router: userRouter,
  },
  {
    path: '/customers',
    router: customerRouter,
  },
  {
    path: '/administrators',
    router: administratorRouter,
  },
  {
    path: '/wallets',
    router: walletRouter,
  },
  {
    path: '/wallet-submissions',
    router: walletSubmissionRouter,
  },
  {
    path: '/wallet-history',
    router: walletHistoryRouter,
  },
  {
    path: '/manual-payment-methods',
    router: manualPaymentMethodRouter,
  },
  {
    path: '/transactions',
    router: transactionRouter,
  },
  {
    path: '/banners',
    router: bannerRouter,
  },
  {
    path: '/top-ups',
    router: topupRouter,
  },
  {
    path: '/offers',
    router: offerRouter,
  },
  {
    path: '/orders',
    router: orderRouter,
  },
  {
    path: '/notifications',
    router: notificationRouter,
  },
  {
    path: '/currencies',
    router: currencyRouter,
  },
  {
    path: '/app-settings',
    router: appSettingRouter,
  },
  {
    path: '/metadata',
    router: metadataRouter,
  },
  {
    path: '/statistics',
    router: statisticsRouter,
  },
];

const routes = moduleRoutes.map((route) => router.use(route.path, route.router));

export default routes;
