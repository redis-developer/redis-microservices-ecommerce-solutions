import type { IMessageHandler } from "../../../common/utils/redis/redis-streams";

import { REDIS_STREAMS } from "../../../common/config/server-config";
import { LoggerCls } from "../../../common/utils/logger";
import { getNodeRedisClient, commandOptions } from "../../../common/utils/redis/redis-wrapper";
import { listenToStream } from "../../../common/utils/redis/redis-streams";

const addPaymentIdToStream = async (orderId: string, paymentId: string) => {
    const nodeRedisClient = getNodeRedisClient();
    if (orderId && nodeRedisClient) {
        const streamKeyName = REDIS_STREAMS.PAYMENTS.STREAM_NAME;
        const entry = {
            "orderId": orderId,
            "paymentId": paymentId
        }
        const id = "*"; //* = auto generate
        await nodeRedisClient.xAdd(streamKeyName, id, entry)
    }
}

const processPaymentForNewOrders: IMessageHandler = async (message, messageId) => {

    if (message && message.orderId) {
        //TODO: make fake payment entry
        const paymentId = "PAID" + message.orderId;

        LoggerCls.info(`order received ${message.orderId}`);

        await addPaymentIdToStream(message.orderId, paymentId);
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