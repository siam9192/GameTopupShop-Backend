import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import currencyService from './currency.service';

class CurrencyController {
  createCurrency = catchAsync(async (req, res) => {
    const result = await currencyService.createCurrencyIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      data: result,
      message: 'Currency created successfully',
    });
  });
  updateCurrency = catchAsync(async (req, res) => {
    const result = await currencyService.updateCurrencyIntoDB(req.params.id, req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Currency updated successfully',
    });
  });
  deleteCurrency = catchAsync(async (req, res) => {
    const result = await currencyService.deleteCurrencyFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Currency deleted successfully',
    });
  });
  getCurrencies = catchAsync(async (req, res) => {
    const result = await currencyService.getCurrenciesFromDB(
      Pick(req.query, ['searchTerm', 'status']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Currencies retrieved Successfully',
    });
  });
  getCurrencyById = catchAsync(async (req, res) => {
    const result = await currencyService.getCurrencyByIdFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Currency retrieved Successfully',
    });
  });
}

export default new CurrencyController();
