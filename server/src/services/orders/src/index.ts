import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

import { router } from './routes';
import { initialize } from './service-impl';
import { SERVER_CONFIG } from '../../../common/config/server-config';
import { setRedis } from '../../../common/utils/redis/redis-wrapper';
import { setPrisma } from '../../../common/utils/prisma/prisma-wrapper';
import { handleProcessAndAppErrors } from '../../../common/utils/misc';

dotenv.config();

//--- config
const REDIS_URI = SERVER_CONFIG.REDIS_URI;
const PORT = SERVER_CONFIG.ORDERS_SERVICE.PORT;
const API_PREFIX = SERVER_CONFIG.ORDERS_SERVICE.API.PREFIX;
//--- config ends

const app: Express = express();

app.use(express.json());
app.use(API_PREFIX, router);

app.get('/', (req: Request, res: Response) => {
  res.send('Express Server for ' + API_PREFIX);
});

app.listen(PORT, async () => {
  await setRedis(REDIS_URI);
  await setPrisma();

  initialize();

  console.log(`Server is running at http://localhost:${PORT}`);
});

handleProcessAndAppErrors(app, process);
