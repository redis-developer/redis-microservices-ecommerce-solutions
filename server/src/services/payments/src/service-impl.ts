import type { IMessageHandler } from "../../../common/utils/redis/redis-streams";

import { REDIS_STREAMS } from "../../../common/config/server-config";
import { LoggerCls } from "../../../common/utils/logger";
import { getNodeRedisClient, commandOptions } from "../../../common/utils/redis/redis-wrapper";
import { listenToStream } from "../../../common/utils/redis/redis-streams";
import { ORDER_STATUS } from "../../../common/models/order";

const addPaymentIdToStream = async (orderId: string, paymentId: string, orderStatus: number) => {
    const nodeRedisClient = getNodeRedisClient();
    if (orderId && nodeRedisClient) {
        const streamKeyName = REDIS_STREAMS.PAYMENTS.STREAM_NAME;
        const entry = {
            "orderId": orderId,
            "paymentId": paymentId,
            "orderStatusCode": orderStatus.toString()
        }
        const id = "*"; //* = auto generate
        await nodeRedisClient.xAdd(streamKeyName, id, entry)
    }
}

const processPaymentForNewOrders: IMessageHandler = async (message, messageId) => {

    if (message && message.orderId) {
        LoggerCls.info(`order received ${message.orderId}`);

        //assuming payment is successful & entry in payments collection is made against that orderId
        const paymentId = "PAY_" + message.orderId;

        await addPaymentIdToStream(message.orderId, paymentId, ORDER_STATUS.PAYMENT_SUCCESS);
    }

}

const listenToOrdersStream = () => {

    listenToStream({
        streamKeyName: REDIS_STREAMS.ORDERS.STREAM_NAME,
        groupName: REDIS_STREAMS.ORDERS.CONSUMER_GROUP_NAME,
        consumerName: REDIS_STREAMS.ORDERS.PAYMENTS_CONSUMER_NAME,
        processMessageCallback: processPaymentForNewOrders
    });
}


export {
    listenToOrdersStream
}