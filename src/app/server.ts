import mongoose from 'mongoose';
import envConfig from './config/env.config';
import app from './app';
import AppSettingModel from './modules/app-setting/app-setting.model';
import CurrencyModel from './modules/currency/currency.model';
import AdministratorModel from './modules/administrator/administrator.model';

async function main() {
  try {
    const connection = await mongoose.connect(envConfig.url.database as string);
    await ensureDefault();
    app.listen(5000, () => {
      console.log('Server is connected');
    });
  } catch (error) {
    console.log(error);
  }
}

async function ensureDefault() {
  await AdministratorModel.ensureDefault();
  await AppSettingModel.ensureDefault();
  await CurrencyModel.ensureDefault();
}

main();
