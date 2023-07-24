import {
  getNodeRedisClient,
  RedisSchema,
  RedisRepository,
  RedisEntityId,
} from '../utils/redis/redis-wrapper';


/*
SAMPLE ORDER 
{
    "orderId": "f23a6fea-358b-4a9e-93af-a5aaa368f16f",
    "orderStatusCode": 4,
    "potentialFraud": false,
    "userId": "USR_be0b1384-442d-4d9c-a707-ca24d7f5ff20",

    "createdOn": "2023-07-10T13:37:42.084Z",
    "createdBy": "USR_be0b1384-442d-4d9c-a707-ca24d7f5ff20",
    "lastUpdatedOn": "2023-07-10T13:37:42.479Z",
    "lastUpdatedBy": "USR_be0b1384-442d-4d9c-a707-ca24d7f5ff20",
    "statusCode": 1,


    "products": [{
        "productId": "11000",
        "productPrice": 3995,
        "qty": 1,

        "productData": {
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
        }
    }],
}

*/
const ORDER_KEY_PREFIX = 'orders:orderId';

const schema = new RedisSchema(ORDER_KEY_PREFIX, {
  orderId: { type: 'string', indexed: true },//--

  orderStatusCode: { type: 'number', indexed: true },//--
  potentialFraud: { type: 'boolean', indexed: false },
  userId: { type: 'string', indexed: true },//--

  createdOn: { type: 'date', indexed: false },
  createdBy: { type: 'string', indexed: true },//--
  lastUpdatedOn: { type: 'date', indexed: false },
  lastUpdatedBy: { type: 'string', indexed: false },
  statusCode: { type: 'number', indexed: true },//--

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

export { getRepository, createRedisIndex, RedisEntityId };
