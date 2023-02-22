//@ts-ignore
import { ObjectId, Document } from "mongodb";

enum DB_ROW_STATUS {
    ACTIVE = 1,
    INACTIVE = 0,
    TO_BE_PURGED = -1
}

enum ORDER_STATUS {
    DRAFT = 0,
    CREATED = 1,
    PAYMENT_SUCCESS = 2,
    PAYMENT_FAIL = -2
}

interface IOrderProduct {
    productId: number;
    qty: number;
    productPrice: number;
}

interface IOrder extends Document {
    orderId: string;
    userId: string;
    orderStatusCode: ORDER_STATUS;

    products: IOrderProduct[];

    _id?: ObjectId | 1 | 0 | string;
    createdOn?: string | Date; // date/ ISO string
    createdBy?: string;
    lastUpdatedOn?: string | Date | null;
    lastUpdatedBy?: string | null;
    statusCode?: DB_ROW_STATUS;
}

export {
    IOrder,
    ORDER_STATUS,
    DB_ROW_STATUS
}