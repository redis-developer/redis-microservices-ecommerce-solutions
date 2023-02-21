import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { setMongodb } from "../../../common/utils/mongodb/node-mongo-wrapper";
import { SERVER_CONFIG } from "../../../common/config/server-config";
import { router } from "./routes";

dotenv.config();

//--- config
const MONGO_DB_URI = SERVER_CONFIG.MONGO_DB_URI;
const MONGO_DB_NAME = SERVER_CONFIG.MONGO_DB_NAME;
const PORT = SERVER_CONFIG.ORDERS_SERVICE.PORT;
const API_PREFIX = SERVER_CONFIG.ORDERS_SERVICE.API.PREFIX;
//--- config ends

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(API_PREFIX, router);

app.get("/", (req: Request, res: Response) => {
    res.send("Express Server for " + API_PREFIX);
});

app.listen(PORT, async () => {
    const mongoPromObj = setMongodb(MONGO_DB_URI, MONGO_DB_NAME);
    await mongoPromObj;

    console.log(`Server is running at http://localhost:${PORT}`);
});