import type { NodeRedisClientType } from './config.js';
import * as path from 'path';
import * as fs from 'fs/promises';

async function addTriggerToRedis(
  fileRelativePath: string,
  redisClient: NodeRedisClientType,
) {
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
}

const triggers = [
  'triggers/key-space-trigger.js',
  'triggers/on-demand-trigger.js',
  'triggers/stream-trigger.js',
];

export async function loadTriggers(redisClient: NodeRedisClientType) {
  await Promise.all(
    triggers.map((trigger) => {
      return addTriggerToRedis(trigger, redisClient);
    }),
  );
}
