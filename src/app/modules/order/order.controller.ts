import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import orderService from './order.service';

class OrderController {
  createOrder = catchAsync(async (req, res) => {
    const result = await orderService.createOrderIntoDB(req.user, req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Order created successfully',
    });
  });
  getOrders = catchAsync(async (req, res) => {
    const result = await orderService.getOrdersFromDB(
      Pick(req.query, ['id', 'customerId', 'status', 'minAmount', 'maxAmount']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Orders retrieved successfully',
    });
  });
  getMyOrders = catchAsync(async (req, res) => {
    const result = await orderService.getMyOrdersFromDB(
      req.user,
      Pick(req.query, ['id', 'status', 'minAmount', 'maxAmount']),
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Orders retrieved successfully',
    });
  });

  getOrderById = catchAsync(async (req, res) => {
    const result = await orderService.getOrderByIdFromDB(req.user, req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Order retrieved Successfully',
    });
  });
}

export default new OrderController();
