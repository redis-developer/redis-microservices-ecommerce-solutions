import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { setMongodb } from '../../../common/utils/mongodb/node-mongo-wrapper';
import { setRedis } from '../../../common/utils/redis/redis-wrapper';
import { SERVER_CONFIG } from '../../../common/config/server-config';

import { listenToOrdersStream } from './service-impl';

dotenv.config();

//--- config
const MONGO_DB_URI = SERVER_CONFIG.MONGO_DB_URI;
const REDIS_URI = SERVER_CONFIG.REDIS_URI;
const PORT = SERVER_CONFIG.PAYMENTS_SERVICE.PORT;
const API_PREFIX = SERVER_CONFIG.PAYMENTS_SERVICE.API.PREFIX;
//--- config ends

const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express Server for ' + API_PREFIX);
});

app.listen(PORT, async () => {
  await setMongodb(MONGO_DB_URI);
  await setRedis(REDIS_URI);

  listenToOrdersStream();

  console.log(`Server is running at http://localhost:${PORT}`);
});
