import {
  ITransactionStreamMessage,
  TransactionPipelines,
} from '../../../common/models/misc';
import type { IDigitalIdentity } from '../../../common/models/digital-identity';
import {
  IMessageHandler,
  nextTransactionStep,
  listenToStreams,
  addMessageToStream,
} from '../../../common/utils/redis/redis-streams';

import {
  TransactionStreamActions,
  DB_ROW_STATUS,
} from '../../../common/models/misc';
import * as digitalIdentityRepo from '../../../common/models/digital-identity-repo';
import { REDIS_STREAMS } from '../../../common/config/server-config';
import { CryptoCls } from '../../../common/utils/crypto';
import { LoggerCls } from '../../../common/utils/logger';

const addMessageToTransactionStream = async (
  message: ITransactionStreamMessage,
) => {
  const streamKeyName = REDIS_STREAMS.STREAMS.TRANSACTIONS;
  await addMessageToStream(message, streamKeyName);
};

const addDigitalIdentityToRedis = async (
  message: ITransactionStreamMessage,
) => {
  let insertedKey = '';
  if (message && message.userId) {
    const userId = message.userId;
    const digitalIdentity: IDigitalIdentity = {
      action: message.action,
      userId: userId,

      createdOn: new Date(),
      createdBy: userId,
      statusCode: DB_ROW_STATUS.ACTIVE,
    };

    if (message.sessionId) {
      digitalIdentity.sessionId = message.sessionId;
    }

    if (message.identityBrowserAgent) {
      digitalIdentity.browserFingerprint = CryptoCls.hashString(
        message.identityBrowserAgent,
      );
    }
    if (message.identityIpAddress) {
      digitalIdentity.ipAddress = message.identityIpAddress;
    }

    if (message.identityScore) {
      digitalIdentity.identityScore = message.identityScore;
    }

    const repository = digitalIdentityRepo.getRepository();
    if (repository) {
      const entity = repository.createEntity(digitalIdentity);
      insertedKey = await repository.save(entity);
    }
  } else {
    throw 'addDigitalIdentityToRedis() input params failed ! ';
  }

  return insertedKey;
};

const calculateIdentityScore = async (message: ITransactionStreamMessage) => {
  let identityScore = 0;
  const repository = digitalIdentityRepo.getRepository();

  if (message && message.userId && repository) {
    let queryBuilder = repository
      .search()
      .where('userId')
      .eq(message.userId)
      .and('action')
      .eq(TransactionStreamActions.INSERT_LOGIN_IDENTITY)
      .and('statusCode')
      .eq(DB_ROW_STATUS.ACTIVE);

    // if (message.sessionId) {//comment if can complete transaction from any of multi logged in devices
    //   queryBuilder = queryBuilder
    //     .and('sessionId')
    //     .eq(message.sessionId)
    // }

    const digitalIdentities = await queryBuilder.return.all();

    if (digitalIdentities && digitalIdentities.length) {
      const matchBrowserItems = digitalIdentities.filter((_digIdent) => {
        return (
          _digIdent.browserFingerprint ==
          CryptoCls.hashString(message.identityBrowserAgent)
        );
      });
      if (matchBrowserItems.length > 0) {
        identityScore += 1;
      }

      const matchIpAddressItems = digitalIdentities.filter((_digIdent) => {
        return _digIdent.ipAddress == message.identityIpAddress;
      });
      if (matchIpAddressItems.length > 0) {
        identityScore += 1;
      }
    }
  }

  const noOfIdentityCharacteristics = 2; //2 == browserFingerprint, ipAddress
  identityScore = identityScore / noOfIdentityCharacteristics;
  return identityScore; // identityScore value from 0 to 1
};

const processTransactionStream: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  LoggerCls.info(`Incomming message in Digital Identity Service ${messageId}`);
  if (message.action == TransactionStreamActions.INSERT_LOGIN_IDENTITY) {
    LoggerCls.info(`Adding digital identity to redis for ${message.userId}`);

    //step 1 - add login digital identity to redis
    const insertedKey = await addDigitalIdentityToRedis(message);
    await addMessageToTransactionStream({
      //adding log To TransactionStream
      ...message,
      action: TransactionStreamActions.LOG,
      logMessage: `New Login Digital Identity added to Redis (JSON) at key  ${insertedKey} for the user ${message.userId}`,
      transactionPipeline: JSON.stringify(TransactionPipelines.LOG),
    });

    return true;
  } else if (
    message.action == TransactionStreamActions.CALCULATE_IDENTITY_SCORE
  ) {
    LoggerCls.info(`Scoring digital identity for ${message.userId}`);
    //step 1 - calculate score for validation digital identity
    const identityScore = await calculateIdentityScore(message);
    message.identityScore = identityScore.toString();
    await addMessageToTransactionStream({
      //adding log To TransactionStream
      ...message,
      action: TransactionStreamActions.LOG_IDENTITY_SCORE,
      logMessage: `${identityScore} is the digital identity score for the user ${message.userId}`,
      identityScore: identityScore.toString(),
      transactionPipeline: JSON.stringify(
        TransactionPipelines.LOG_IDENTITY_SCORE,
      ),
    });

    LoggerCls.info(`Adding digital identity to redis for ${message.userId}`);
    //step 2 - add validation digital identity to redis
    const insertedKey = await addDigitalIdentityToRedis(message);
    await addMessageToTransactionStream({
      //adding log To TransactionStream
      ...message,
      action: TransactionStreamActions.LOG,
      logMessage: `Validation Digital Identity added to Redis (JSON) at key ${insertedKey} for the user ${message.userId}`,
      identityScore: identityScore.toString(),
      transactionPipeline: JSON.stringify(TransactionPipelines.LOG),
    });

    await nextTransactionStep({
      ...message,
      logMessage: `Requesting next step in transaction risk scoring for the user ${message.userId}`,

      identityScore: identityScore.toString(),
    });

    //step 3 - trigger "payment consumer" for the order
    //   await addOrderDetailsToStream(message);
    //   await addMessageToTransactionStream({
    //     //adding log To TransactionStream
    //     userId: message.userId,
    //     sessionId: message.sessionId,
    //     sessionData: message.sessionData,
    //     action: TransactionStreamActions.LOG,
    //     logMessage: `To process payment, order details are added to ${REDIS_STREAMS.ORDERS.STREAM_NAME} for the user ${message.userId}`,
    //     orderDetails: message.orderDetails,
    //   });

    return true;
  }

  return false;
};

const listenToTransactionStream = () => {
  listenToStreams({
    streams: [
      {
        streamKeyName: REDIS_STREAMS.STREAMS.TRANSACTIONS,
        processMessageCallback: processTransactionStream,
      },
    ],
    groupName: REDIS_STREAMS.GROUPS.IDENTITY,
    consumerName: REDIS_STREAMS.CONSUMERS.IDENTITY,
  });
};

const initialize = () => {
  listenToTransactionStream();
};

export { initialize };
