import { PrismaClient, Prisma } from '@prisma/client';

import { SERVER_CONFIG } from '../../config/server-config';

class PrismaWrapperCls {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient({
      log: SERVER_CONFIG.PRISMA_LOG as Prisma.LogDefinition[],
    });

    this.prisma.$on<any>('query', (event: any) => {
      //query logging
      const e = event as Prisma.QueryEvent;
      console.log('Query: ' + e.query);
      console.log('Params: ' + e.params);
      console.log('Duration: ' + e.duration + 'ms');
    });
  }

  async connect() {
    try {
      await this.prisma.$connect();
    } catch (err) {
      console.error('Error in prisma connect !', err);
    }
  }

  async disconnect() {
    try {
      await this.prisma.$disconnect();
    } catch (err) {
      console.error('Error in prisma disconnect !', err);
    }
  }
}

let prismaWrapperInst: PrismaWrapperCls;

const setPrisma = () => {
  prismaWrapperInst = new PrismaWrapperCls();
};
const getPrisma = () => {
  return prismaWrapperInst;
};
const getPrismaClient = () => {
  return prismaWrapperInst.prisma;
};

export { setPrisma, getPrisma, getPrismaClient };

export type { PrismaWrapperCls };
