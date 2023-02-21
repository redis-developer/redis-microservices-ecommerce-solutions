interface IApiResponseBody {
    data: unknown,
    error: unknown
}
//@ts-ignore
const envVariables = process.env;

const SERVER_CONFIG = {

    MONGO_DB_URI: envVariables.MONGO_DB_CONNECTION_URI || "mongodb://localhost:27017/dbFashion",
    MONGO_DB_NAME: envVariables.MONGO_DB_NAME || "dbFashion",
    SERVER_ORIGIN: "http://localhost",
    API_GATEWAY: {
        PORT: envVariables.API_GATEWAY_PORT || 3000,
    },
    ORDERS_SERVICE: {
        PORT: envVariables.ORDERS_SERVICE_PORT || 3001,
        API: {
            PREFIX: "/orders",
            CREATE_ORDER: "/createOrder",  // http://localhost:3000/api/orders/createOrder
            VIEW_ORDER_HISTORY: "/viewOrderHistory"
        }

    }

}


export {
    SERVER_CONFIG,
    IApiResponseBody
}