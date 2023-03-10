import { createClient, commandOptions } from 'redis';
import {
  Client as RedisOmClient,
  Entity as RedisEntity,
  Schema as RedisSchema,
} from 'redis-om';

import { LoggerCls } from '../logger';

type NodeRedisClientType = ReturnType<typeof createClient>;

class RedisWrapperCls {
  connectionURL: string;
  nodeRedisClient: NodeRedisClientType | null;
  redisOmClient: RedisOmClient | null;

  constructor(_connectionURL: string) {
    this.connectionURL = _connectionURL;
    this.nodeRedisClient = null;
    this.redisOmClient = null;
  }

  async getConnection() {
    if (!this.nodeRedisClient && this.connectionURL) {
      this.nodeRedisClient = createClient({ url: this.connectionURL });

      this.nodeRedisClient.on('error', (err) => {
        LoggerCls.error('Redis Client Error', err);
      });

      await this.nodeRedisClient.connect();
      LoggerCls.info('redis-wrapper ', 'Connected successfully to Redis');
    }
    return this.nodeRedisClient;
  }

  async closeConnection(): Promise<void> {
    if (this.nodeRedisClient) {
      await this.nodeRedisClient.disconnect();
    }
  }
}

let redisWrapperInst: RedisWrapperCls;

const setRedis = async (_connectionURL: string) => {
  redisWrapperInst = new RedisWrapperCls(_connectionURL);
  const nodeRedisClient = await redisWrapperInst.getConnection();

  //---RedisOM
  if (nodeRedisClient) {
    const redisOmPromObj = new RedisOmClient().use(nodeRedisClient);
    redisWrapperInst.redisOmClient = await redisOmPromObj;
  }
  //---
  return nodeRedisClient;
};

const getRedis = (): RedisWrapperCls => {
  return redisWrapperInst;
};
const getNodeRedisClient = () => {
  return redisWrapperInst.nodeRedisClient;
};
const getRedisOmClient = () => {
  return redisWrapperInst.redisOmClient;
};

export {
  setRedis,
  getRedis,
  getNodeRedisClient,
  commandOptions,
  getRedisOmClient,
  RedisEntity,
  RedisSchema,
};

export type { RedisWrapperCls, NodeRedisClientType };
