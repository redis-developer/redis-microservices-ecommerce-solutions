import type { IOrder } from '../../../common/models/order';

import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import * as OrderRepo from '../../../common/models/order-repo';

const viewOrderHistory = async (userId: string) => {
  if (userId) {
    const repository = OrderRepo.getRepository();
    let orders: Partial<IOrder>[] = [];
    if (repository) {
      const queryBuilder = repository
        .search()
        .where('createdBy')
        .eq(userId)
        .and('orderStatusCode')
        .gte(ORDER_STATUS.CREATED) //returns CREATED and PAYMENT_SUCCESS
        .and('statusCode')
        .eq(DB_ROW_STATUS.ACTIVE);

      console.log(queryBuilder.query);
      orders = <Partial<IOrder>[]>await queryBuilder.return.all();
    }

    return orders;
  } else {
    throw 'userId is mandatory!';
  }
};

export { viewOrderHistory };
