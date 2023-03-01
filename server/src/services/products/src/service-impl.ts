import type { Document } from "../../../common/utils/mongodb/node-mongo-wrapper";

import { COLLECTIONS } from "../../../common/config/server-config";
import { DB_ROW_STATUS } from "../../../common/models/order";
import { getMongodb } from "../../../common/utils/mongodb/node-mongo-wrapper";
import { MAX_DOCUMENTS_FETCH_LIMIT } from "../../../common/config/constants";

interface IProductFilter {
    productDisplayName: string
}


const getProductsByFilter = async (productFilter: IProductFilter) => {

    const mongodbWrapperInst = getMongodb();
    const filter: Document = {
        statusCode: {
            $eq: DB_ROW_STATUS.ACTIVE
        }
    };

    if (productFilter && productFilter.productDisplayName) {

        filter["data.productDisplayName"] = {
            $regex: productFilter.productDisplayName,
            $options: 'i'
        }
    }


    const projection = {
        "data.id": 1,
        "data.price": 1,
        "data.productDisplayName": 1,
        "data.variantName": 1,
        "data.brandName": 1,
        "data.ageGroup": 1,
        "data.gender": 1,
        "data.displayCategories": 1,
        "data.styleImages.default.imageURL": 1,

    }
    const limit = MAX_DOCUMENTS_FETCH_LIMIT;
    const sort = {};
    const products = await mongodbWrapperInst.find(COLLECTIONS.PRODUCTS.collectionName, filter, projection, limit, sort);
    return products;

}

export {
    getProductsByFilter
}