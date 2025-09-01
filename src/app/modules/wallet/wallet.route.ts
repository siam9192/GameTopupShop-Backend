import { Router } from "express";
import { AdministratorLevel } from "../User/user.interface";
import auth from "../../middlewares/auth";
import walletController from "./wallet.controller";
import validateRequest from "../../middlewares/validateRequest";
import walletValidations from "./wallet.validation";

const router =  Router()

router.get(
  '/',
  auth(Object.values(AdministratorLevel),walletController.getWalletByCustomerId),
  
);
router.get('/:id', auth(Object.values(AdministratorLevel)),walletController.getWalletById);

router.get('/customer/:id', auth(Object.values(AdministratorLevel)),walletController.getWalletById);

router.patch('/balance',auth(Object.values(AdministratorLevel)),validateRequest(walletValidations.updateWalletBalanceValidation),walletController.updateWalletBalance)
const walletRouter =  router

export default walletRouter