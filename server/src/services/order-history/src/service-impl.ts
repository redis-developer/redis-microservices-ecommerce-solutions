import type { IOrder } from '../../../common//models/order-repo';

import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import * as OrderRepo from '../../../common/models/order-repo';

const viewOrderHistory = async (userId: string) => {
  if (userId) {
    const repository = OrderRepo.getRepository();
    let orders: IOrder[] = [];
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
      const result = await queryBuilder.return.all();

      orders = result.map((elm) => {
        let item: IOrder = {
          orderId: elm.orderId,
          userId: elm.userId,
          orderStatusCode: elm.orderStatusCode,
          products: elm.productsStr ? JSON.parse(elm.productsStr) : [], //temp
          createdOn: elm.createdOn,
          createdBy: elm.createdBy,
          lastUpdatedOn: elm.lastUpdatedOn,
          lastUpdatedBy: elm.lastUpdatedBy,
        };

        return item;
      });
    }

    return orders;
  } else {
    throw 'userId is mandatory!';
  }
};

export { viewOrderHistory };
