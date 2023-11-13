import type { NodeRedisClientType } from './config.js';
import * as path from 'path';
import * as fs from 'fs/promises';

const addTriggerToRedis = async (
  fileRelativePath: string,
  redisClient: NodeRedisClientType,
) => {
  const filePath = path.join(__dirname, fileRelativePath);
  const fileData = await fs.readFile(filePath);
  let jsCode = fileData.toString();
  jsCode = jsCode.replace(/\r?\n/g, '\n');

  try {
    const result = await redisClient.sendCommand([
      'TFUNCTION',
      'LOAD',
      'REPLACE',
      jsCode,
    ]);
    console.log(`addTriggersToRedis ${fileRelativePath}`, result);
  } catch (err) {
    console.log(err);
  }
};

export const loadTriggers = async (redisClient: NodeRedisClientType) => {
  await addTriggerToRedis('triggers/key-space-trigger.js', redisClient);
  await addTriggerToRedis(
    'triggers/key-space-trigger-manual-test.js',
    redisClient,
  );
  await addTriggerToRedis('triggers/manual-trigger.js', redisClient);
  await addTriggerToRedis('triggers/stream-trigger.js', redisClient);
};
