import type { Document } from '../mongodb/node-mongo-wrapper';

import { CryptoCls } from '../crypto';
import { getNodeRedisClient } from './redis-wrapper';

class RedisCacheAside {
  static getHashKey(_filter: Document) {
    let retKey = '';

    if (_filter) {
      retKey = 'CACHE_ASIDE_' + CryptoCls.hashString(JSON.stringify(_filter));
    }

    return retKey;
  }

  static setDataInRedis(
    _filter: Document,
    _data: Document[],
    _expirySec: number,
  ): Promise<string | void> {
    let promObj: Promise<string | void> = new Promise((resolve, reject) => {
      const nodeRedisClient = getNodeRedisClient();

      if (_data && _data.length && _filter && nodeRedisClient) {
        const hashKey = RedisCacheAside.getHashKey(_filter);
        const dataStr = JSON.stringify(_data);

        nodeRedisClient
          .set(hashKey, dataStr, {
            EX: _expirySec,
          })
          .then(() => {
            resolve(hashKey);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject('Input params failed setDataInRedis() !');
      }
    });

    return promObj;
  }

  static getDataFromRedis(_filter: Document): Promise<Document[]> {
    const promObj: Promise<Document[]> = new Promise((resolve, reject) => {
      const nodeRedisClient = getNodeRedisClient();
      if (_filter && nodeRedisClient) {
        const hashKey = RedisCacheAside.getHashKey(_filter);
        nodeRedisClient
          .get(hashKey)
          .then((data) => {
            const docArr = data ? JSON.parse(data) : [];
            resolve(docArr);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject('Input params failed getDataFromRedis()!');
      }
    });
    return promObj;
  }
}

export { RedisCacheAside };
