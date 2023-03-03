import fs from 'fs';
import path from 'path';
import { Seeder } from 'mongo-seeding';

class MongoSeederCls {
  constructor(_allCollectionsPath, _dbConnectionUrl, _collectionTransformer) {
    if (_allCollectionsPath && _dbConnectionUrl) {
      this.allCollectionsPath = _allCollectionsPath;
      if (_collectionTransformer) {
        this.collectionTransformer = _collectionTransformer;
      }

      const config = {
        database: _dbConnectionUrl,
        dropCollections: true, //drop collection before insert
        //dropDatabase: true,
      };
      this.seederLib = new Seeder(config);
    } else {
      console.log('MongoSeederCls constructor() params missing!');
    }
  }

  async seedCollections() {
    try {
      if (this.allCollectionsPath) {
        fs.readdirSync(this.allCollectionsPath).forEach(
          async (serialFolderName) => {
            const serialFolderPath =
              this.allCollectionsPath + '/' + serialFolderName;

            const serialCollectionNames = [];
            fs.readdirSync(serialFolderPath).forEach((collectionName) => {
              serialCollectionNames.push(collectionName);
            });

            const collectionReadingOptions = {
              transformers: [this.collectionTransformer],
            };
            console.log(
              `Reading ${serialCollectionNames.join(
                ',',
              )} collection(s) data from disk`,
            );
            let seedData = this.seederLib.readCollectionsFromPath(
              path.resolve(serialFolderPath),
              collectionReadingOptions,
            );

            console.log(
              `Seeding ${serialCollectionNames.join(
                ',',
              )} collection(s) data to mongodb`,
            );
            await this.seederLib.import(seedData);
          },
        );
      }
    } catch (err) {
      console.log('seedCollections() failed !');
      console.log(err);
    }
  }
}

export { MongoSeederCls };
