import type { IRiskStreamMessage } from '../../../common/models/misc';
import type { IDigitalIdentity } from '../../../common/models/digital-identity';
import type { IMessageHandler } from '../../../common/utils/redis/redis-streams';

import { RiskStreamActions, DB_ROW_STATUS } from '../../../common/models/misc';
import * as digitalIdentityRepo from '../../../common/models/digital-identity-repo';
import { REDIS_STREAMS } from '../../../common/config/server-config';
import { CryptoCls } from '../../../common/utils/crypto';
import { listenToStream, addMessageToStream } from '../../../common/utils/redis/redis-streams';

const addMessageToTransactionRiskStream = async (message: IRiskStreamMessage) => {
  const streamKeyName = REDIS_STREAMS.TRANSACTION_RISK.STREAM_NAME;
  await addMessageToStream(message, streamKeyName);
}

const addDigitalIdentityToRedis = async (message: IRiskStreamMessage) => {
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

const calculateIdentityScore = async (message: IRiskStreamMessage) => {
  let identityScore = 0;
  const repository = digitalIdentityRepo.getRepository();

  if (message && message.userId && repository) {
    let queryBuilder = repository
      .search()
      .where('userId')
      .eq(message.userId)
      .and('action')
      .eq(RiskStreamActions.INSERT_LOGIN_IDENTITY)
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

const processTransactionRiskStream: IMessageHandler = async (
  message: IRiskStreamMessage,
  messageId,
) => {
  if (message) {
    if (message.action == RiskStreamActions.INSERT_LOGIN_IDENTITY) {
      //step 1 - add login identity JSON to redis
      const insertedKey = await addDigitalIdentityToRedis(message);

      //step 2 - add confirmation log to redis stream
      await addMessageToTransactionRiskStream({
        userId: message.userId,
        sessionId: message.sessionId,
        action: RiskStreamActions.LOG,
        logMessage: `New Login Identity added for the user ${message.userId} at key ${insertedKey}`
      });
    }
    else if (message.action == RiskStreamActions.CALCULATE_IDENTITY_SCORE) {
      //step 1 - calculate score for validation identity
      const identityScore = await calculateIdentityScore(message);
      message.identityScore = identityScore.toString();

      //step 2 - add validation identity JSON to redis
      const insertedKey = await addDigitalIdentityToRedis(message);

      //step 3 - add confirmation log to redis stream
      await addMessageToTransactionRiskStream({
        userId: message.userId,
        sessionId: message.sessionId,
        action: RiskStreamActions.LOG_IDENTITY_SCORE,
        logMessage: `Validation Identity received for the user ${message.userId} at key ${insertedKey} and calculated identity score for it is ${identityScore}`,
        identityScore: identityScore.toString()
      });
    }
  }

};

const listenToTransactionRiskStream = () => {
  listenToStream({
    streamKeyName: REDIS_STREAMS.TRANSACTION_RISK.STREAM_NAME,
    groupName: REDIS_STREAMS.TRANSACTION_RISK.CONSUMER_GROUP_NAME,
    consumerName: REDIS_STREAMS.TRANSACTION_RISK.IDENTITY_CONSUMER_NAME,
    processMessageCallback: processTransactionRiskStream,
  });
};

export { listenToTransactionRiskStream };
