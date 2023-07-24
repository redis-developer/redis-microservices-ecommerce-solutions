import type { IOrder } from '../../../common/models/order';

import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import * as OrderRepo from '../../../common/models/order-repo';
import { SERVER_CONFIG } from '../../../common/config/server-config';

const convertNestedProductsObjToArray = (orders: Partial<IOrder>[]) => {
  /** RDI Ingest sample :  products is object rather Array
  let sample = {
    "products": {
      "clk2s6nq00001p58j1n2er9yn": {
        "_id": "clk2s6nq00001p58j1n2er9yn",
        "productid": "11007",
        "productprice": 9495,
        "qty": 1,
        "productData":"", //as string
         ...
      },
      "clk2s6nq10002p58jcg2gkksm": {
        "_id": "clk2s6nq10002p58jcg2gkksm",
        "productid": "11008",
        "productprice": 499,
        "qty": 1,
        "productData":"", //as string
         ...
      }
    },
    "_id": "e2472ab5-fa29-4c70-bbb4-ff93ec7d263c",
    "orderstatuscode": 4,
    "potentialfraud": false,
    "userid": "USR_f8e5fc86-79bd-476d-83e7-37f3be43a804",
    "createdon": 1689351365017,
    "createdby": "USR_f8e5fc86-79bd-476d-83e7-37f3be43a804",
    "lastupdatedon": 1689351365050,
    "lastupdatedby": "USR_f8e5fc86-79bd-476d-83e7-37f3be43a804",
    "statuscode": 1
  }  */
  if (orders && orders.length) {
    for (let ord of orders) {
      if (ord.products && Object.values(ord.products)?.length) {
        //FIX 1 (object to array)
        ord.products = Object.values(ord.products);

        for (let prod of ord.products) {
          if (prod.productData && typeof prod.productData == "string") {
            //FIX 2
            prod.productData = JSON.parse(prod.productData);
          }
        }
      }
      //FIX 3
      if (ord.createdOn && typeof ord.createdOn == "number") {
        ord.createdOn = new Date(ord.createdOn);
      }
      if (ord.lastUpdatedOn && typeof ord.lastUpdatedOn == "number") {
        ord.lastUpdatedOn = new Date(ord.lastUpdatedOn);
      }
    }
  }
  return orders;
}

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

      if (SERVER_CONFIG.IS_RDI_ENABLED) {
        orders = convertNestedProductsObjToArray(orders);
      }

    }

    return orders;
  } else {
    throw 'userId is mandatory!';
  }
};

export { viewOrderHistory };
