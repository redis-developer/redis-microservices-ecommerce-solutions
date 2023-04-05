import { REDIS_STREAMS } from '../../config/server-config';
import {
  ITransactionStreamMessage,
  TransactionStreamActions,
} from '../../models/misc';
import { LoggerCls } from '../logger';
import { getNodeRedisClient, commandOptions } from './redis-wrapper';

interface IMessageHandler {
  (message: any, messageId: string): Promise<boolean>;
}

interface ListenStreamOptions {
  streams: {
    streamKeyName: string;
    processMessageCallback: IMessageHandler;
  }[];
  groupName: string;
  consumerName: string;
  maxNoOfEntriesToReadAtTime?: number;
}

const listenToStreams = async (options: ListenStreamOptions) => {
  const nodeRedisClient = getNodeRedisClient();
  if (nodeRedisClient) {
    const streams = options.streams;
    const groupName = options.groupName;
    const consumerName = options.consumerName;
    const readMaxCount = options.maxNoOfEntriesToReadAtTime || 100;

    try {
      const idPosition = '0'; //0 = start, $ = end or any specific id
      await Promise.all(
        streams.map((stream) => {
          return nodeRedisClient.xGroupCreate(
            stream.streamKeyName,
            groupName,
            idPosition,
            {
              MKSTREAM: true,
            },
          );
        }),
      );
      LoggerCls.info(`Created consumer group ${groupName}`);
    } catch (err) {
      LoggerCls.error('Consumer group already exists !'); //, err
    }

    LoggerCls.info(`Starting consumer ${consumerName}.`);

    while (true) {
      try {
        //read set of messages from different streams
        const dataArr = await nodeRedisClient.xReadGroup(
          commandOptions({
            isolated: true,
          }),
          groupName,
          consumerName,
          streams.map((stream) => ({ key: stream.streamKeyName, id: '>' })),
          {
            COUNT: readMaxCount, // Read n entries at a time
            BLOCK: 5, //block for 0 (infinite) seconds if there are none.
          },
        );

        // dataArr = [
        //   {
        //     name: 'streamName',
        //     messages: [
        //       {
        //         id: '1642088708425-0',
        //         message: {
        //           key1: 'value1',
        //         },
        //       },
        //     ],
        //   },
        // ];
        if (dataArr && dataArr.length) {
          for (let data of dataArr) {
            for (let messageItem of data.messages) {
              const streamKeyName = data.name;

              const stream = streams.find(
                (s) => s.streamKeyName == streamKeyName,
              );

              if (!stream || !messageItem.message) {
                continue;
              }

              const handled = await stream.processMessageCallback(
                messageItem.message,
                messageItem.id,
              );

              //acknowledge individual messages after processing
              if (handled) {
                nodeRedisClient.xAck(streamKeyName, groupName, messageItem.id);
              }
            }
          }
        }
      } catch (err) {
        LoggerCls.error('xReadGroup error !', err);
      }
    }
  }
};

const addMessageToStream = async (message, streamKeyName) => {
  try {
    const nodeRedisClient = getNodeRedisClient();
    if (nodeRedisClient && message && streamKeyName) {
      const id = '*'; //* = auto generate
      await nodeRedisClient.xAdd(streamKeyName, id, message);
    }
  } catch (err) {
    LoggerCls.error('addMessageToStream error !', err);
    LoggerCls.error(streamKeyName, message);
  }
};

const nextTransactionStep = async (message: ITransactionStreamMessage) => {
  const transactionPipeline: TransactionStreamActions[] = JSON.parse(
    message.transactionPipeline,
  );
  transactionPipeline.shift();

  if (transactionPipeline.length <= 0) {
    return;
  }

  const streamKeyName = REDIS_STREAMS.STREAMS.TRANSACTIONS;
  await addMessageToStream(
    {
      ...message,
      action: transactionPipeline[0],
      transactionPipeline: JSON.stringify(transactionPipeline),
    },
    streamKeyName,
  );
};

interface ILogStreamMessage {
  action: string;
  message: string;
  metadata: any;
}

const streamLog = async (message: ILogStreamMessage) => {
  await addMessageToStream(
    {
      action: message.action,
      message: message.message,
      metadata: JSON.stringify(message.metadata),
    },
    REDIS_STREAMS.STREAMS.LOG,
  );
};

export { listenToStreams, addMessageToStream, nextTransactionStep, streamLog };

export type { IMessageHandler };
