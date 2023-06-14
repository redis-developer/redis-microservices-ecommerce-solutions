import { REDIS_STREAMS } from '../../config/server-config';
import {
  ITransactionStreamMessage,
  TransactionStreamActions,
} from '../../models/misc';
import { LoggerCls } from '../logger';
import { getNodeRedisClient, commandOptions } from './redis-wrapper';

interface ILogStreamMessage {
  action: string;
  message: string;
  metadata: any;
}

interface IMessageHandler {
  (message: any, messageId: string): Promise<boolean>;
}

interface ListenStreamOptions {
  streams: {
    streamKeyName: string;
    eventHandlers: {
      [messageAction: string]: IMessageHandler;
    };
  }[];
  groupName: string;
  consumerName: string;
  maxNoOfEntriesToReadAtTime?: number;
}

const listenToStreams = async (options: ListenStreamOptions) => {
  /*
     (A) create consumer group for the stream
     (B) read set of messages from the stream
     (C) process all messages received
     (D) trigger appropriate action callback for each message
     (E) acknowledge individual messages after processing
    */
  const nodeRedisClient = getNodeRedisClient();
  if (nodeRedisClient) {
    const streams = options.streams;
    const groupName = options.groupName;
    const consumerName = options.consumerName;
    const readMaxCount = options.maxNoOfEntriesToReadAtTime || 100;
    const idInitialPosition = '0'; //0 = start, $ = end or any specific id
    const streamKeyIdArr: {
      key: string;
      id: string;
    }[] = [];

    streams.map(async (stream) => {
      LoggerCls.info(
        `Creating consumer group ${groupName} in stream ${stream.streamKeyName}`,
      );

      try {
        // (A) create consumer group for the stream

        await nodeRedisClient.xGroupCreate(
          stream.streamKeyName,
          groupName,
          idInitialPosition,
          {
            MKSTREAM: true,
          },
        );
      } catch (err) {
        LoggerCls.error(
          `Consumer group ${groupName} already exists in stream ${stream.streamKeyName}!`,
        ); //, err
      }

      streamKeyIdArr.push({
        key: stream.streamKeyName,
        id: '>', // Next entry ID that no consumer in this group has read
      });
    });

    LoggerCls.info(`Starting consumer ${consumerName}.`);

    while (true) {
      try {
        // (B) read set of messages from different streams
        const dataArr = await nodeRedisClient.xReadGroup(
          commandOptions({
            isolated: true,
          }),
          groupName,
          consumerName,
          //can specify multiple streams in array [{key, id}]
          streamKeyIdArr,
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

        //(C) process all messages received
        if (dataArr && dataArr.length) {
          for (let data of dataArr) {
            for (let messageItem of data.messages) {
              const streamKeyName = data.name;

              const stream = streams.find(
                (s) => s.streamKeyName == streamKeyName,
              );

              if (stream && messageItem.message) {
                const streamEventHandlers = stream.eventHandlers;
                const messageAction = messageItem.message.action;
                const messageHandler = streamEventHandlers[messageAction];

                if (messageHandler) {
                  // (D) trigger appropriate action callback for each message

                  await messageHandler(messageItem.message, messageItem.id);
                }
                //(E) acknowledge individual messages after processing
                nodeRedisClient.xAck(streamKeyName, groupName, messageItem.id);
              }
            }
          }
        } else {
          // LoggerCls.info('No new stream entries.');
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

  if (transactionPipeline.length > 0) {
    const streamKeyName = REDIS_STREAMS.STREAMS.TRANSACTIONS;
    await addMessageToStream(
      {
        ...message,
        action: transactionPipeline[0],
        transactionPipeline: JSON.stringify(transactionPipeline),
      },
      streamKeyName,
    );
  }
};

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
