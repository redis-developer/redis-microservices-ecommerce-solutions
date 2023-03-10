import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { router } from './routes';
import * as OrderRepo from '../../../common/models/order-repo';
import { SERVER_CONFIG } from '../../../common/config/server-config';
import { setRedis } from '../../../common/utils/redis/redis-wrapper';

dotenv.config();

//--- config
const REDIS_URI = SERVER_CONFIG.REDIS_URI;
const PORT = SERVER_CONFIG.ORDER_HISTORY_SERVICE.PORT;
const API_PREFIX = SERVER_CONFIG.ORDER_HISTORY_SERVICE.API.PREFIX;
//--- config ends

const app: Express = express();

app.use(express.json());
app.use(API_PREFIX, router);

app.get('/', (req: Request, res: Response) => {
  res.send('Express Server for ' + API_PREFIX);
});

app.listen(PORT, async () => {
  await setRedis(REDIS_URI);
  await OrderRepo.createRedisIndex();

  console.log(`Server is running at http://localhost:${PORT}`);
});
