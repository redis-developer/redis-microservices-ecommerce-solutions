import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const args = process.argv.slice(2);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destinationFolders = [
    "database/prisma",
    "server/src/api-gateway/prisma-generated",
    "server/src/common/prisma-generated",
    "server/src/services/digital-identity/prisma-generated",
    "server/src/services/order-history/prisma-generated",
    "server/src/services/orders/prisma-generated",
    "server/src/services/payments/prisma-generated",
    "server/src/services/products/prisma-generated",
    "server/src/services/profile/prisma-generated",
];

const copySelectedSchemaToAllServices = async () => {
    if (args && args.length) {
        const databaseType = args[0];

        const srcFile = `database/prisma/schema.${databaseType}.prisma`;

        for (let destPath of destinationFolders) {
            try {
                const targetFile = `${destPath}/schema.prisma`;

                //check folder exists else create
                await fs.access(destPath).catch((e) => {
                    return fs.mkdir(path.join(__dirname, destPath));
                });

                await fs.copyFile(srcFile, targetFile);
            }
            catch (err) {
                console.log(`destination copy failed ${destPath} !`);
                console.error(err);
            }
        }
    }
}

const generateTypesInAllServices = async () => {
    for (let destPath of destinationFolders) {
        try {

            let promObj = new Promise((resolve, reject) => {
                let cmd = `cd ${destPath} && cd .. && npm install && npm run build`;
                console.log(cmd);

                const process = spawn(cmd, { shell: true });
                process.on('exit', function (code) {
                    resolve(code);
                });
                process.on('error', function (err) {
                    reject(err);
                });
                process.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
            });

            await promObj;

        }
        catch (err) {
            console.error(err);
        }
    }
}

const initialize = async () => {
    await copySelectedSchemaToAllServices();
    await generateTypesInAllServices();
}

initialize();
