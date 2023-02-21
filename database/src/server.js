import * as dotenv from 'dotenv';
import { MongoSeederCls } from "./utils/mongo-seeder.js";

dotenv.config();

const collectionTransformer = (_collection) => {
    //using product id as mongo db document _id
    if (_collection && _collection.documents && _collection.documents.length) {
        for (let item of _collection.documents) {
            if (item.data && item.data.id) {
                item._id = item.data.id;
            }
        }
    }
    return _collection;
}

const seedDatabase = async () => {
    const mongoSeederInst = new MongoSeederCls(
        "fashion-dataset/",
        process.env.MONGO_DB_CONNECTION_URI,
        collectionTransformer
    );

    await mongoSeederInst.seedCollections();
}

seedDatabase();