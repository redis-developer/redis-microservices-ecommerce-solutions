import type { IOrder, Product } from '../../../common/models/order';
import type { ITransactionStreamMessage } from '../../../common/models/misc';

import { Prisma } from '@prisma/client';

import {
  IMessageHandler,
  nextTransactionStep,
  listenToStreams,
  streamLog,
} from '../../../common/utils/redis/redis-streams';

import { TransactionStreamActions } from '../../../common/models/misc';
import { REDIS_STREAMS } from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';
import { getNodeRedisClient } from '../../../common/utils/redis/redis-wrapper';

const calculateProfileScore: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  let retVal = false;

  LoggerCls.info(`Incoming message in Profile Service ${messageId}`);
  if (message.orderDetails && message.persona) {
    await streamLog({
      action: TransactionStreamActions.CALCULATE_PROFILE_SCORE,
      message: `[${REDIS_STREAMS.CONSUMERS.PROFILE}] Calculating profile score for the user ${message.userId}`,
      metadata: message,
    });

    // check profile score
    const { products }: IOrder = JSON.parse(message.orderDetails);
    const persona = message.persona.toLowerCase();
    let score = 0;
    const nodeRedisClient = getNodeRedisClient();

    if (nodeRedisClient) {
      const initialCat: {
        [key: string]: boolean;
      } = {};
      const categories = products.reduce((cat, product) => {
        const productData = <Product>product.productData;
        const masterCategory = productData.masterCategory_typeName;
        const subCategory = productData.subCategory_typeName;

        if (masterCategory) {
          cat[`${masterCategory}`.toLowerCase()] = true;

          if (subCategory) {
            cat[`${masterCategory}:${subCategory}`.toLowerCase()] = true;
          }
        }

        return cat;
      }, initialCat);

      const categoryKeys = Object.keys(categories);
      const checks = categoryKeys.length;

      LoggerCls.info(
        `Checking ${checks} categories: ${JSON.stringify(categoryKeys)}`,
      );

      await Promise.all(
        categoryKeys.map(async (category) => {
          const exists = await nodeRedisClient.bf.exists(
            `bfprofile:${category}`.toLowerCase(),
            persona,
          );

          if (exists) {
            score += 1;
          }
        }),
      );

      LoggerCls.info(`After ${checks} checks, total score is ${score}`);
      score = score / (checks || 1);

      await streamLog({
        action: TransactionStreamActions.CALCULATE_PROFILE_SCORE,
        message: `[${REDIS_STREAMS.CONSUMERS.PROFILE}] Profile score for the user ${message.userId} is ${score}`,
        metadata: message,
      });

      await nextTransactionStep({
        ...message,
        logMessage: `[${REDIS_STREAMS.CONSUMERS.PROFILE}] Requesting next step in transaction risk scoring for the user ${message.userId}`,
        profileScore: `${score}`,
      });

      retVal = true;
    }
  }
  return retVal;
};

const listen = () => {
  listenToStreams({
    streams: [
      {
        streamKeyName: REDIS_STREAMS.STREAMS.TRANSACTIONS,
        eventHandlers: {
          [TransactionStreamActions.CALCULATE_PROFILE_SCORE]:
            calculateProfileScore,
        },
      },
    ],
    groupName: REDIS_STREAMS.GROUPS.PROFILE,
    consumerName: REDIS_STREAMS.CONSUMERS.PROFILE,
  });
};

const initialize = () => {
  listen();
};

export { initialize };
