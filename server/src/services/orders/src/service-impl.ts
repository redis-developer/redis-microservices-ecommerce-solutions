import * as yup from "yup";

import { COLLECTIONS } from "../../../common/config/server-config";
import { YupCls } from "../../../common/utils/yup";
import { ORDER_STATUS, DB_ROW_STATUS, IOrder } from "../../../common/models/order";
import { getMongodb } from "../../../common/utils/mongodb/node-mongo-wrapper";
import { USERS } from "../../../common/config/constants";
import * as OrderRepo from "../../../common//models/order-repo";


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
    let orderId = "";
    if (order) {
        const repository = OrderRepo.getRepository();
        if (repository) {
            const entity = repository.createEntity(order);
            orderId = entity.entityId;
            entity.orderId = orderId;
            entity.productsStr = JSON.stringify(order.products);
            await repository.save(entity);
        }
    }

    return orderId;
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
        //add to redis
        const orderId = await addOrderToRedis(order);

        /**
         * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
         * To keep it simple, adding  data to MongoDB manually in the same service
         */
        const mongodbWrapperInst = getMongodb();
        order.orderId = orderId;
        //add to mongodb
        await mongodbWrapperInst.insertOne(COLLECTIONS.ORDERS.collectionName, COLLECTIONS.ORDERS.keyName, order);

        return orderId;
    }
    else {
        throw "Order data is mandatory!";
    }
}

export {
    createOrder
}