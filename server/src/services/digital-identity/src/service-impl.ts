import type { ITransactionStreamMessage } from '../../../common/models/misc';
import type { IDigitalIdentity } from '../../../common/models/digital-identity';
import type { IMessageHandler } from '../../../common/utils/redis/redis-streams';

import { TransactionStreamActions, DB_ROW_STATUS } from '../../../common/models/misc';
import * as digitalIdentityRepo from '../../../common/models/digital-identity-repo';
import { REDIS_STREAMS } from '../../../common/config/server-config';
import { CryptoCls } from '../../../common/utils/crypto';
import { listenToStream, addMessageToStream } from '../../../common/utils/redis/redis-streams';

const addOrderDetailsToStream = async (message: ITransactionStreamMessage) => {
  const streamKeyName = REDIS_STREAMS.ORDERS.STREAM_NAME;
  let orderDetails = message.identityTransactionDetails;
  if (orderDetails) {
    orderDetails = JSON.parse(orderDetails);
  }
  await addMessageToStream(orderDetails, streamKeyName);
};

const addMessageToTransactionStream = async (message: ITransactionStreamMessage) => {
  const streamKeyName = REDIS_STREAMS.TRANSACTION.STREAM_NAME;
  await addMessageToStream(message, streamKeyName);
}

const addDigitalIdentityToRedis = async (message: ITransactionStreamMessage) => {
  let insertedKey = "";
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
      digitalIdentity.browserFingerprint = CryptoCls.hashString(message.identityBrowserAgent);
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
  }
  else {
    throw "addDigitalIdentityToRedis() input params failed ! ";
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

    console.log(queryBuilder.query);
    const digitalIdentities = await queryBuilder.return.all();

    if (digitalIdentities && digitalIdentities.length) {

      const matchBrowserItems = digitalIdentities.filter((_digIdent) => {
        return _digIdent.browserFingerprint == CryptoCls.hashString(message.identityBrowserAgent);
      })
      if (matchBrowserItems.length > 0) {
        identityScore += 1;
      }

      const matchIpAddressItems = digitalIdentities.filter((_digIdent) => {
        return _digIdent.ipAddress == message.identityIpAddress;
      })
      if (matchIpAddressItems.length > 0) {
        identityScore += 1;
      }
    }
  }

  const noOfIdentityCharacteristics = 2; //2 == browserFingerprint, ipAddress 
  identityScore = identityScore / noOfIdentityCharacteristics;
  return identityScore; // identityScore value from 0 to 1
}

const processTransactionStream: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  if (message) {
    if (message.action == TransactionStreamActions.INSERT_LOGIN_IDENTITY) {
      //step 1 - add login digital identity to redis
      const insertedKey = await addDigitalIdentityToRedis(message);
      await addMessageToTransactionStream({ //adding log To TransactionStream
        userId: message.userId,
        sessionId: message.sessionId,
        action: TransactionStreamActions.LOG,
        logMessage: `New Login Digital Identity added to Redis (JSON) at key  ${insertedKey} for the user ${message.userId}`
      });
    }
    else if (message.action == TransactionStreamActions.CALCULATE_IDENTITY_SCORE) {
      //step 1 - calculate score for validation digital identity
      const identityScore = await calculateIdentityScore(message);
      message.identityScore = identityScore.toString();
      await addMessageToTransactionStream({//adding log To TransactionStream
        action: TransactionStreamActions.LOG_IDENTITY_SCORE,
        logMessage: `${identityScore} is the digital identity score for the user ${message.userId}`,
        userId: message.userId,
        sessionId: message.sessionId,
        identityScore: identityScore.toString()
      });

      //step 2 - add validation digital identity to redis
      const insertedKey = await addDigitalIdentityToRedis(message);
      await addMessageToTransactionStream({//adding log To TransactionStream
        userId: message.userId,
        sessionId: message.sessionId,
        action: TransactionStreamActions.LOG,
        logMessage: `Validation Digital Identity added to Redis (JSON) at key ${insertedKey} for the user ${message.userId}`,
        identityScore: identityScore.toString()
      });

      //step 3 - trigger "payment consumer" for the order
      await addOrderDetailsToStream(message);
      await addMessageToTransactionStream({//adding log To TransactionStream
        userId: message.userId,
        sessionId: message.sessionId,
        action: TransactionStreamActions.LOG,
        logMessage: `To process payment, order details are added to ${REDIS_STREAMS.ORDERS.STREAM_NAME} for the user ${message.userId}`,
        identityTransactionDetails: message.identityTransactionDetails
      });
    }
  }

};

const listenToTransactionStream = () => {
  listenToStream({
    streamKeyName: REDIS_STREAMS.TRANSACTION.STREAM_NAME,
    groupName: REDIS_STREAMS.TRANSACTION.CONSUMER_GROUP_NAME,
    consumerName: REDIS_STREAMS.TRANSACTION.IDENTITY_CONSUMER_NAME,
    processMessageCallback: processTransactionStream,
  });
};

export { listenToTransactionStream };
