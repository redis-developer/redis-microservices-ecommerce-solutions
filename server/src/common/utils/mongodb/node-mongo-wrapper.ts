import {
  MongoClient,
  ObjectId,

  //types
  MongoClientOptions,
  Db,
  Filter,
  Document,
  CollationOptions,
  Sort,
  ClientSession,
  InsertOneOptions,
  UpdateOptions,
} from 'mongodb';

import { LoggerCls } from '../logger';

class NodeMongoWrapperCls {
  connectionURL: string;
  dbName: string;
  globalConnection?: MongoClient | null;
  globalDB?: Db | null;

  constructor(_connectionURL: string) {
    this.connectionURL = _connectionURL;
    this.dbName = '';
  }

  getConnection(): Promise<Db> {
    let promObj: Promise<Db> = new Promise((resolve, reject) => {
      if (this.globalConnection && this.globalDB) {
        resolve(this.globalDB);
      } else {
        if (this.connectionURL) {
          const connectOptions: MongoClientOptions = {
            // useNewUrlParser: true,
            //authSource: "admin"
          };
          MongoClient.connect(this.connectionURL, connectOptions)
            .then((client) => {
              //const db = client.db(this.dbName);
              const db = client.db();
              this.dbName = db.databaseName;
              LoggerCls.info(
                'node-mongo-wrapper ',
                'Connected successfully to DB ' + this.dbName,
              );
              this.globalConnection = client;
              this.globalDB = db;

              resolve(db);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject('connectionURL missing');
        }
      }
    });

    promObj = promObj.catch((err) => {
      LoggerCls.error('node-mongo-wrapper getConnection()', err);
      throw err;
    });

    return promObj;
  }

  closeConnection() {
    if (this.globalConnection) {
      this.globalConnection.close();
      this.globalConnection = null;
      this.globalDB = null;
      LoggerCls.info(
        'node-mongo-wrapper closeGlobalConnection()',
        'Disconnected from DB',
      );
    }
  }

  find(
    _collectionName: string,
    _filter: Filter<Document>,
    _projection: Document,
    _limit: number,
    _sort: Sort,
  ): Promise<Document[]> {
    let promObj: Promise<Document[]> = new Promise((resolve, reject) => {
      if (_collectionName) {
        let collation: CollationOptions;
        if (!_filter) {
          _filter = {};
        }
        if (!_projection) {
          _projection = {};
        }
        if (!_limit) {
          _limit = 100;
        }
        if (!_sort) {
          _sort = {};
        } else if (Object.keys(_sort).length) {
          collation = {
            locale: 'en',
          };
        }

        this.getConnection()
          .then((db: Db) => {
            const startNow = performance.now();

            db.collection(_collectionName)
              .find(_filter)
              .collation(collation) // added to sort case insensitively(English Alphabets)
              .sort(_sort)
              .limit(_limit)
              .project(_projection)
              .toArray()
              .then((data) => {
                //--perf--
                const endNow = performance.now();
                const logData = {
                  collectionName: _collectionName,
                  filter: _filter,
                  stats: endNow - startNow,
                };
                // LoggerCls.info("find perf-", logData);
                //--perf ends--
                resolve(data);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject('Input params validation failed!');
      }
    });

    promObj = promObj.catch((err) => {
      LoggerCls.error('node-mongo-wrapper find()', err);
      throw err;
    });

    return promObj;
  }

  insertOne(
    _collectionName: string,
    _keyName: string,
    _document: Document,
    _session?: ClientSession,
  ): Promise<string> {
    let promObj: Promise<string> = new Promise((resolve, reject) => {
      if (_collectionName && _document) {
        const passedId = _document[_keyName] || _document['_id'];

        _document['_id'] = passedId || new ObjectId();
        if (_keyName) {
          _document[_keyName] = _document['_id'];
        }

        this.getConnection()
          .then((db: Db) => {
            const insertOptions: InsertOneOptions = {};
            if (_session) {
              insertOptions.session = _session;
            }

            db.collection(_collectionName)
              .insertOne(_document, insertOptions)
              .then((res) => {
                if (res && res.insertedId) {
                  resolve(res.insertedId.toString());
                } else {
                  reject(res);
                }
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject('Input params validation failed!');
      }
    });

    promObj = promObj.catch((err) => {
      LoggerCls.error('node-mongo-wrapper insertOne()', err);
      throw err;
    });

    return promObj;
  }

  updateOne(
    _collectionName: string,
    _filter: Filter<Document>,
    _updateProp: Document,
    _session?: ClientSession,
  ): Promise<number> {
    let promObj: Promise<number> = new Promise((resolve, reject) => {
      if (_collectionName && _filter && _updateProp) {
        this.getConnection()
          .then((db: Db) => {
            const updateOptions: UpdateOptions = {};
            if (_session) {
              updateOptions.session = _session;
            }

            db.collection(_collectionName)
              .updateOne(_filter, _updateProp, updateOptions)
              .then((res) => {
                if (res && res.modifiedCount == 1) {
                  resolve(res.modifiedCount);
                } else {
                  reject(res);
                }
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject('Input params validation failed!');
      }
    });

    promObj = promObj.catch((err) => {
      LoggerCls.error('node-mongo-wrapper updateOne()', err);
      throw err;
    });

    return promObj;
  }

  group(
    _collectionName: string,
    _filter: Filter<Document>,
    _group: Document,
  ): Promise<Document[]> {
    let promObj: Promise<Document[]> = new Promise((resolve, reject) => {
      if (_collectionName) {
        if (!_filter) {
          _filter = {};
        }
        if (!_group) {
          _group = {};
        }

        this.getConnection()
          .then((db: Db) => {
            db.collection(_collectionName)
              .aggregate([
                {
                  $match: _filter,
                },
                {
                  $group: _group,
                },
              ])
              .toArray()
              .then((data) => {
                resolve(data);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject('Input params validation failed!');
      }
    });

    promObj = promObj.catch((err) => {
      LoggerCls.error('node-mongo-wrapper group()', err);
      throw err;
    });

    return promObj;
  }

  aggregate(
    _collectionName: string,
    _pipelineArr: Document[],
  ): Promise<Document[]> {
    let promObj: Promise<Document[]> = new Promise((resolve, reject) => {
      if (
        _collectionName &&
        _pipelineArr instanceof Array &&
        _pipelineArr.length
      ) {
        this.getConnection()
          .then((db: Db) => {
            const startNow = performance.now();
            db.collection(_collectionName)
              .aggregate(_pipelineArr)
              .toArray()
              .then((data) => {
                //--perf--
                const endNow = performance.now();
                const logData = {
                  collectionName: _collectionName,
                  filter: _pipelineArr,
                  stats: endNow - startNow,
                };
                LoggerCls.info('aggregate perf-', logData);
                //--perf ends--

                resolve(data);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject('Input params validation failed!');
      }
    });
    promObj = promObj.catch((err) => {
      LoggerCls.error('node-mongo-wrapper aggregate()', err);
      throw err;
    });
    return promObj;
  }
}

let mongodbWrapperInst: NodeMongoWrapperCls;

const setMongodb = async (_connectionURL: string): Promise<Db> => {
  mongodbWrapperInst = new NodeMongoWrapperCls(_connectionURL);
  const conDb = await mongodbWrapperInst.getConnection(); //connect mongo
  return conDb;
};

const getMongodb = (): NodeMongoWrapperCls => {
  return mongodbWrapperInst;
};

export { setMongodb, getMongodb };

export type { NodeMongoWrapperCls, Document };
