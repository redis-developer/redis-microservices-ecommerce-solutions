import type { NodeRedisClientType } from './config.js';

import axios from 'axios';
import zlib from 'zlib';

let logSeqNum = 1;

const consoleLog = (msg: string, isAddSeq?: boolean) => {
    let seq = '';

    if (isAddSeq) {
        seq = `(${logSeqNum}) `;
        logSeqNum++;
    }

    if (msg) {
        msg = `-----${seq}${msg}-----`;
        console.log(msg);
    }
}

const fetchZipFileJSON = async (_url: string) => {
    let str = '';

    if (_url && _url.match(/\.gz$/)) {
        try {
            const response = await axios.get(_url, {
                responseType: 'arraybuffer'
            });

            const bufferData = Buffer.from(response.data, 'binary');
            const decompressed = zlib.gunzipSync(bufferData);
            str = JSON.parse(decompressed.toString());

        } catch (error) {
            console.error(`Error fetchFileZipJSON: ${_url}`, error);
        }
    }
    return str;

}

const fetchFileData = async (_url: string) => {
    let jsonData = '';
    try {
        let response = await axios.get(_url);
        jsonData = response.data;
    }
    catch (err: any) {
        if (err?.response?.status === 404) {
            throw `Error 404: Resource not found - ${_url}` //short error
        }
        else {
            throw err;
        }
    }

    return jsonData;
}

const fetchImageAndConvertToBase64 = async (_imageURL: string) => {
    let base64Image = '';
    try {
        const response = await axios.get(_imageURL, {
            responseType: 'arraybuffer'
        });

        // Convert image to Base64
        base64Image = Buffer.from(response.data, 'binary').toString('base64');

    } catch (error) {
        console.error(`Error fetching or converting the image: ${_imageURL}`, error);
    }
    return base64Image;

}

const deleteExistingKeysInRedis = async (_keyPrefix: string, redisClient: NodeRedisClientType) => {

    if (_keyPrefix) {
        const existingKeys = await redisClient?.keys(`${_keyPrefix}:*`);
        if (existingKeys?.length) {
            console.log(`deleting existing keys/ index starting with ${_keyPrefix}`);
            await redisClient?.del(existingKeys);
        }
    }
}

export {
    consoleLog,
    fetchZipFileJSON,
    fetchFileData,
    fetchImageAndConvertToBase64,
    deleteExistingKeysInRedis
}