import { objectId } from '../../helpers';
import { calculatePagination } from '../../helpers/paginationHelper';
import { IAuthUser, IPaginationOptions } from '../../types';
import { UserRole } from '../user/user.interface';
import NotificationModel from './notification.model';

class NotificationService {
  async getMyNotificationsFromDB(authUser: IAuthUser, paginationOptions: IPaginationOptions) {
    const whereConditions: Record<string, unknown> = {};
    if (authUser.role === UserRole.CUSTOMER) {
      whereConditions.customerId = authUser.userId;
    } else {
      whereConditions.administratorId = authUser.userId;
    }

    const { page, skip, limit, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const notifications = await NotificationModel.find(whereConditions)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalResults = await NotificationModel.countDocuments(whereConditions);

    return {
      data: notifications,
      meta: {
        page,
        limit,
        totalResults,
      },
    };
  }

  async notificationsSetAsRead(authUser: IAuthUser, payload: { ids: string[] }) {
    const { userId, role } = authUser;
    await NotificationModel.updateMany(
      {
        _id: { $in: payload.ids.map((_) => objectId(_)) },
      },
      role === UserRole.CUSTOMER ? { customerId: userId } : { administratorId: userId }
    );

    return await NotificationModel.find({ _id: { $in: payload.ids.map((_) => objectId(_)) } });
  }
}

export default new NotificationService();
