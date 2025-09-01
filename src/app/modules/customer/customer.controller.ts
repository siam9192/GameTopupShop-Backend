import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import { CustomersFilterPayload } from './customer.interface';
import customerService from './customer.service';

class CustomerController {
  getCustomers = catchAsync(async (req, res) => {
    const result = customerService.getCustomersFromDB(
      Pick(req.query, ['searchTerm', 'fullName', 'email', 'status']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Customers retrieved Successfully',
    });
  });
  getCustomerById = catchAsync(async (req, res) => {
    const result = customerService.getCustomerByIdFromDB(req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Customer retrieved Successfully',
    });
  });
  changeCustomerStatus = catchAsync(async (req, res) => {
    const result = customerService.changeCustomerStatusIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Customers retrieved Successfully',
    });
  });
}

export default new CustomerController();
