import { getPrisma } from './prisma/prisma-wrapper';

const handleProcessAndAppErrors = (_app, _process) => {
  _app.on('error', (error, ctx) => {
    let data = {
      error: error,
      ctx: ctx,
    };
    console.error('index.ts - app error event', data);
  });

  _process.on('SIGINT', async () => {
    // interrupt signal like ctrl + c
    console.error('index.ts - process SIGINT event');

    const prismaWrapperInst = getPrisma();
    await prismaWrapperInst.disconnect();

    _process.exit(0);
  });

  _process.on('SIGTERM', async () => {
    //on kill (not supported on windows)
    console.error('index.ts - process SIGTERM event');

    const prismaWrapperInst = getPrisma();
    await prismaWrapperInst.disconnect();
  });
  _process.on('uncaughtException', async (ex) => {
    console.error('index.ts - process uncaughtException event');

    const prismaWrapperInst = getPrisma();
    await prismaWrapperInst.disconnect();
  });

  _process.on('exit', async (code) => {
    //nothing in event loop
    console.error('index.ts - process exit event' + code);

    const prismaWrapperInst = getPrisma();
    await prismaWrapperInst.disconnect();
  });
};

export { handleProcessAndAppErrors };
