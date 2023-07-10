import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

import { initialize } from './service-impl';
import * as profileRepo from '../../../common/models/profile-repo';
import { SERVER_CONFIG } from '../../../common/config/server-config';
import { setRedis } from '../../../common/utils/redis/redis-wrapper';

dotenv.config();

//--- config
const REDIS_URI = SERVER_CONFIG.REDIS_URI;
const PORT = SERVER_CONFIG.PROFILE_SERVICE.PORT;
const API_PREFIX = SERVER_CONFIG.PROFILE_SERVICE.API.PREFIX;
//--- config ends

const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express Server for ' + API_PREFIX);
});

app.listen(PORT, async () => {
  await setRedis(REDIS_URI);
  await profileRepo.initialize();

  initialize();

  console.log(`Server is running at http://localhost:${PORT}`);
});
