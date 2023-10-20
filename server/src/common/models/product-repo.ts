import {
  getNodeRedisClient,
  RedisSchema,
  RedisRepository,
  RedisEntityId,
} from '../utils/redis/redis-wrapper';


/*
SAMPLE PRODUCT 
{
  "productId": "11000",
  "price": 3995,
  "productDisplayName": "Puma Men Slick 3HD Yellow Black Watches",
  "variantName": "Slick 3HD Yellow",
  "brandName": "Puma",
  "ageGroup": "Adults-Men",
  "gender": "Men",
  "displayCategories": "Accessories",
  "masterCategory_typeName": "Accessories",
  "subCategory_typeName": "Watches",
  "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11000.jpg",
  "productDescriptors_description_value": "...",
  "stockQty":10
   ...
}
 
*/
const PRODUCT_KEY_PREFIX = 'products:productId'; //also in database/src/config.ts

const schema = new RedisSchema(PRODUCT_KEY_PREFIX, {
  productId: { type: 'string', indexed: true },
  price: { type: 'number', indexed: true },
  productDisplayName: { type: 'text', indexed: true },
  productDescriptors_description_value: { type: 'text', indexed: true },
  stockQty: { type: 'number', indexed: true },
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

export { getRepository, createRedisIndex, RedisEntityId, PRODUCT_KEY_PREFIX };
