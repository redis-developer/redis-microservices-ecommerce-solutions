import type {
  IOrderDetails,
  ITransactionStreamMessage,
} from '../../../common/models/misc';
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
  LoggerCls.info(`Incomming message in Profile Service ${messageId}`);
  if (!(message.orderDetails && message.persona)) {
    return false;
  }

  await streamLog({
    action: TransactionStreamActions.CALCULATE_PROFILE_SCORE,
    message: `[${REDIS_STREAMS.CONSUMERS.PROFILE}] Calculating profile score for the user ${message.userId}`,
    metadata: message,
  });

  // check profile score
  const { products }: IOrderDetails = JSON.parse(message.orderDetails);
  const persona = message.persona.toLowerCase();
  let score = 0;
  const nodeRedisClient = getNodeRedisClient();

  if (!nodeRedisClient) {
    return false;
  }

  const categories = products.reduce((cat, product) => {
    const masterCategory = product.productData?.masterCategory?.typeName;
    const subCategory = product.productData?.subCategory?.typeName;

    if (masterCategory) {
      cat[`${masterCategory}`.toLowerCase()] = true;

      if (subCategory) {
        cat[`${masterCategory}:${subCategory}`.toLowerCase()] = true;
      }
    }

    return cat;
  }, {} as Record<string, boolean>);

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

  return true;
};

const listenToTransactionStream = () => {
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
  listenToTransactionStream();
};

export { initialize };
