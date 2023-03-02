import type { Document } from "../../../common/utils/mongodb/node-mongo-wrapper";
import type { IProduct } from "../../../common/models/product";

import * as yup from "yup";

import { COLLECTIONS } from "../../../common/config/server-config";
import { YupCls } from "../../../common/utils/yup";
import { ORDER_STATUS, DB_ROW_STATUS, IOrder } from "../../../common/models/order";
import { getMongodb } from "../../../common/utils/mongodb/node-mongo-wrapper";
import { USERS, MAX_DOCUMENTS_FETCH_LIMIT } from "../../../common/config/constants";
import * as OrderRepo from "../../../common/models/order-repo";



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

    //@ts-ignore
    _order = await YupCls.validateSchema(_order, schema);

    return _order;
}

const addProductDataToOrders = (order: IOrder, products: IProduct[]) => {
    if (order && order.products?.length && products.length) {
        for (let orderedProduct of order.products) {
            orderedProduct.productData = products.find((_p) => _p._id == orderedProduct.productId)?.data;
        }
    }
    return order;
}
const getProductDetails = async (order: IOrder) => {
    let products: IProduct[] = [];

    if (order && order.products?.length) {
        const productIdArr = order.products.map((product) => {
            return product.productId;
        });

        const mongodbWrapperInst = getMongodb();
        const filter: Document = {
            statusCode: {
                $eq: DB_ROW_STATUS.ACTIVE
            },
            _id: { //_id == productId 
                $in: productIdArr
            }
        };

        const projection: IProduct = {
            productId: 1,
            data: {
                id: 1,
                price: 1,
                productDisplayName: 1,
                variantName: 1,
                brandName: 1,
                ageGroup: 1,
                gender: 1,
                displayCategories: 1,
                styleImages: {
                    default: {
                        imageURL: 1,
                    }
                },
                productDescriptors: {
                    description: {
                        value: 1
                    }
                }
            }
        }
        const limit = MAX_DOCUMENTS_FETCH_LIMIT;
        const sort = {};
        products = await mongodbWrapperInst.find(COLLECTIONS.PRODUCTS.collectionName, filter, projection, limit, sort);
    }

    return products;
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

const addOrderToMongoDB = async (order: IOrder) => {

    const mongodbWrapperInst = getMongodb();
    await mongodbWrapperInst.insertOne(COLLECTIONS.ORDERS.collectionName, COLLECTIONS.ORDERS.keyName, order);
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

        const products = await getProductDetails(order);
        addProductDataToOrders(order, products);

        const orderId = await addOrderToRedis(order);
        order.orderId = orderId;

        /**
         * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
         * To keep it simple, adding  data to MongoDB manually in the same service
         */
        await addOrderToMongoDB(order);

        return orderId;
    }
    else {
        throw "Order data is mandatory!";
    }
}

export {
    createOrder
}