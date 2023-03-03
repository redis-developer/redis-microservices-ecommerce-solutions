import { LoggerCls } from '../logger';
import { getNodeRedisClient, commandOptions } from './redis-wrapper';

interface IMessageHandler {
  (message: any, messageId: string): Promise<void>;
}

interface listenStreamOptions {
  streamKeyName: string;
  groupName: string;
  consumerName: string;
  maxNoOfEntriesToReadAtTime?: number;
  processMessageCallback: IMessageHandler;
}

const listenToStream = async (options: listenStreamOptions) => {
  const nodeRedisClient = getNodeRedisClient();
  if (nodeRedisClient) {
    const streamKeyName = options.streamKeyName;
    const groupName = options.groupName;
    const consumerName = options.consumerName;
    const readMaxCount = options.maxNoOfEntriesToReadAtTime || 100;

    try {
      const idPosition = '0'; //0 = start, $ = end or any specific id
      await nodeRedisClient.xGroupCreate(streamKeyName, groupName, idPosition, {
        MKSTREAM: true,
      });
      LoggerCls.info(`Created consumer group ${groupName}`);
    } catch (err) {
      LoggerCls.error('Consumer group already exists !', err);
    }

    console.log(`Starting consumer ${consumerName}.`);

    while (true) {
      try {
        //read set of messages from different streams
        const dataArr = await nodeRedisClient.xReadGroup(
          commandOptions({
            isolated: true,
          }),
          groupName,
          consumerName,
          [
            {
              //can specify multiple streams in array
              key: streamKeyName,
              id: '>', // Next entry ID that no consumer in this group has read
            },
          ],
          {
            COUNT: readMaxCount, // Read n entries at a time
            BLOCK: 0, //block for 0 (infinite) seconds if there are none.
          },
        );

        /* 
                 dataArr = [
                     {
                         "name": "streamName",
                         "messages": [
                             {
                                 "id": "1642088708425-0",
                                 "message": {
                                     "key1": "value1"
                                 }
                             }
                         ]
                     }
                 ]
                 */
        if (dataArr && dataArr.length) {
          for (let data of dataArr) {
            for (let messageItem of data.messages) {
              await options.processMessageCallback(
                messageItem.message,
                messageItem.id,
              );

              //acknowledge individual messages after processing
              nodeRedisClient.xAck(streamKeyName, groupName, messageItem.id);
            }
          }
        } else {
          LoggerCls.info('No new stream entries.');
        }
      } catch (err) {
        LoggerCls.error('xReadGroup error !', err);
      }
    }
  }
};

export { listenToStream };

export type { IMessageHandler };
