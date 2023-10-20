import {
  getNodeRedisClient,
  RedisSchema,
  RedisRepository,
  RedisEntityId,
} from '../utils/redis/redis-wrapper';

// FT.INFO storeInventory:storeInventoryId:index , to check indexed doc count ..etc
const STORE_INVENTORY_KEY_PREFIX = 'storeInventory:storeInventoryId'; //also in database/src/config.ts

const schema = new RedisSchema(STORE_INVENTORY_KEY_PREFIX, {
  storeId: { type: 'string', indexed: true },
  storeLocation: { type: "point", indexed: true }, // long,lat

  productId: { type: 'string', indexed: true },
  productDisplayName: { type: 'text', indexed: true },
  quantity: { type: 'number', indexed: true },
  statusCode: { type: 'number', indexed: true },
});

/*
 A Repository is the main interface into Redis OM. It gives us the methods to read, write, and remove a specific Entity
 */

const getRepository = () => {
  const redisClient = getNodeRedisClient();
  const repository = new RedisRepository(schema, redisClient);
  return repository;
};

/*
we need to create an index or we won't be able to search.
Redis OM uses hash to see if index needs to be recreated or not 
*/

const createRedisIndex = async () => {
  const repository = getRepository();
  await repository.createIndex();
};

export { getRepository, createRedisIndex, RedisEntityId, STORE_INVENTORY_KEY_PREFIX };
