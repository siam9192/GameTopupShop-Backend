import { paginationOptionPicker } from '../../helpers/paginationHelper';
import httpStatus from '../../shared/http-status';
import catchAsync from '../../utils/catchAsync';
import Pick from '../../utils/pick';
import { sendSuccessResponse } from '../../utils/response';
import orderService from './order.service';

class OrderController {
  createOrder = catchAsync(async (req, res) => {
    const result = await orderService.updateOrderStatusIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Order status updated',
    });
  });
  updateOrderStatus = catchAsync(async (req, res) => {
    const result = await orderService.updateOrderStatusIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      message: 'Order updated successfully',
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
  getRecentOrders = catchAsync(async (req, res) => {
    const result = await orderService.getRecentOrdersFromDB(
      req.params.recentDate,
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Recent orders retrieved successfully',
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
  getMyRecentOrders = catchAsync(async (req, res) => {
    const result = await orderService.getMyRecentOrdersFromDB(
      req.user,
      req.params.recentDate,
      paginationOptionPicker(req.query)
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      ...result,
      message: 'Recent orders retrieved successfully',
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
