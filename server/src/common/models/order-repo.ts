import type { IOrder } from './order';
import {
  getRedisOmClient,
  RedisEntity,
  RedisSchema,
} from '../utils/redis/redis-wrapper';

//for typescript
interface OrderEntity extends IOrder {}

/*
An Entity is the class that holds you data when you work with it.
It is what you create, read, update, and delete.
*/
class OrderEntity extends RedisEntity {}

/*
schema defines the fields on your entity, their types, and
how they are mapped internally to Redis.
Valid types are: string, number, boolean, string[], date, point, and text.
*/

const schema = new RedisSchema(OrderEntity, {
  orderId: { type: 'string' },
  userId: { type: 'string' },
  orderStatusCode: { type: 'number' },

  productsStr: { type: 'string' }, //redis om (node) upcoming version will support nested JSON

  createdOn: { type: 'date' },
  createdBy: { type: 'string' },
  lastUpdatedOn: { type: 'date' },
  lastUpdatedBy: { type: 'string' },
  statusCode: { type: 'number' },
});

/*
 A Repository is the main interface into Redis OM. It gives us the methods to read, write, and remove a specific Entity
 */

const getRepository = () => {
  const redisOmClient = getRedisOmClient();
  return redisOmClient?.fetchRepository(schema);
};

/*
we need to create an index or we won't be able to search.
Redis OM uses hash to see if index needs to be recreated or not 
*/

const createRedisIndex = async () => {
  const repository = getRepository();
  if (repository) {
    await repository.createIndex();
  }
};

export { getRepository, createRedisIndex };

export type { OrderEntity, IOrder };
