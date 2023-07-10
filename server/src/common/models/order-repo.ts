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
const ORDER_KEY_PREFIX = 'Order';

const schema = new RedisSchema(ORDER_KEY_PREFIX, {
  orderId: { type: 'string' },

  orderStatusCode: { type: 'number' },
  potentialFraud: { type: 'boolean' },
  userId: { type: 'string' },

  createdOn: { type: 'date' },
  createdBy: { type: 'string' },
  lastUpdatedOn: { type: 'date' },
  lastUpdatedBy: { type: 'string' },
  statusCode: { type: 'number' },

  //----------- products array----
  productId: { type: "string", path: "$.products[*].productId" },
  productPrice: { type: "number", path: "$.products[*].productPrice" },
  productQty: { type: "number", path: "$.products[*].qty" },

  productDataId: { type: "string", path: "$.products[*].productData.productId" },
  productDataPrice: { type: "string", path: "$.products[*].productData.price" },
  productDisplayName: { type: "string", path: "$.products[*].productData.productDisplayName" },
  productVariantName: { type: "string", path: "$.products[*].productData.variantName" },
  productBrandName: { type: "string", path: "$.products[*].productData.brandName" },
  productAgeGroup: { type: "string", path: "$.products[*].productData.ageGroup" },
  productGender: { type: "string", path: "$.products[*].productData.gender" },
  productDisplayCategories: { type: "string", path: "$.products[*].productData.displayCategories" },
  productMasterCategoryType: { type: "string", path: "$.products[*].productData.masterCategory_typeName" },
  productSubCategoryType: { type: "string", path: "$.products[*].productData.subCategory_typeName" },
  productImageURL: { type: "string", path: "$.products[*].productData.styleImages_default_imageURL" },
  productDescription: { type: "string", path: "$.products[*].productData.productDescriptors_description_value" },
  //----------- products array ends----


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
