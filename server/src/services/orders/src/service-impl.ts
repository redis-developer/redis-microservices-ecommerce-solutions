import * as yup from "yup";

import { COLLECTIONS } from "../../../common/config/server-config";
import { YupCls } from "../../../common/utils/yup";
import { ORDER_STATUS, DB_ROW_STATUS, IOrder } from "../../../common/models/order";
import { getMongodb } from "../../../common/utils/mongodb/node-mongo-wrapper";
import { getRedisClient } from "../../../common/utils/redis/node-redis-wrapper";
import { USERS } from "../../../common/config/constants";


const validateOrder = async (_order) => {

    const schema = yup.object().shape({
        orderId: yup.string(),
        userId: yup.string().required(),
        orderStatusCode: yup.number().required(),

        products: yup.array().of(
            yup.object().shape({
                productId: yup.number().required(),
                qty: yup.number().required(),
                productPrice: yup.number().required(),
            })
        ).min(1),

        createdOn: yup.date().required(),
        createdBy: yup.string().required(),
        lastUpdatedOn: yup.date().nullable(),
        lastUpdatedBy: yup.string().nullable(),
        statusCode: yup.number().required()
    });

    _order = await YupCls.validateSchema(_order, schema);

    return _order;
}

const addOrderToRedis = async (order: IOrder) => {
    if (order) {
        const redisClient = getRedisClient();
        if (redisClient) {
            const key = COLLECTIONS.ORDERS.collectionName + ":" + order.orderId;
            //@ts-ignore
            await redisClient.json.set(key, "$", order);
        }
    }
}


const createOrder = async (order: IOrder) => {
    if (order) {
        order.orderStatusCode = ORDER_STATUS.CREATED;
        order.userId = USERS.DEFAULT; //temp as no login/ users functionality

        order.createdOn = new Date();
        order.createdBy = order.userId;
        order.lastUpdatedOn = null;
        order.lastUpdatedBy = null;
        order.statusCode = DB_ROW_STATUS.ACTIVE;

        order = await validateOrder(order);
        const mongodbWrapperInst = getMongodb();
        //add to database
        const orderId = await mongodbWrapperInst.insertOne(COLLECTIONS.ORDERS.collectionName, COLLECTIONS.ORDERS.keyName, order);
        //add to cache
        await addOrderToRedis(order);

        return orderId;
    }
    else {
        throw "Order data is mandatory!";
    }
}

export {
    createOrder
}