#!/bin/bash

SOURCE_PRISMA=../../../../database/prisma/
TARGET_PRISMA=prisma-generated/

cd ../server/src/

#---------------------
cd api-gateway/src/
cp -r $SOURCE_PRISMA ../$TARGET_PRISMA
npm run build
cd ../../

#---------------------

cd services/digital-identity/
cp -r $SOURCE_PRISMA $TARGET_PRISMA
npm run build
cd ../../

cd services/order-history/
cp -r $SOURCE_PRISMA $TARGET_PRISMA
npm run build
cd ../../

cd services/orders/
cp -r $SOURCE_PRISMA $TARGET_PRISMA
npm run build
cd ../../

cd services/payments/
cp -r $SOURCE_PRISMA $TARGET_PRISMA
npm run build
cd ../../

cd services/products/
cp -r $SOURCE_PRISMA $TARGET_PRISMA
npm run build
cd ../../

cd services/profile/
cp -r $SOURCE_PRISMA $TARGET_PRISMA
npm run build
cd ../../

#---------------------
cd ../../
