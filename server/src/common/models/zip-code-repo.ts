import {
  getNodeRedisClient,
  RedisSchema,
  RedisRepository,
  RedisEntityId,
} from '../utils/redis/redis-wrapper';

// FT.INFO zipCodes:zipCode:index , to check indexed doc count ..etc
const ZIP_CODE_KEY_PREFIX = 'zipCodes:zipCode'; //also in database/src/config.ts

const schema = new RedisSchema(ZIP_CODE_KEY_PREFIX, {
  zipCode: { type: 'number', indexed: true, sortable: true },
  zipLocation: { type: "point", indexed: true }, // long,lat
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

export { getRepository, createRedisIndex, RedisEntityId, ZIP_CODE_KEY_PREFIX };
