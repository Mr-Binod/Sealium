import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {join} from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  app.use(cors({
  	origin: ['https://vcv.sealiumback.store', 'https://sealiumback.store', 'sealiumback.store', 'http://localhost:3000','http://localhost:3001', 'https://verify.sealiumback.store','https://admin.sealiumback.store' ], // 배열로 안 해도 됨
  	credentials: true,                   // 쿠키 허용	
}))
  app.use('/uploads', express.static(join(__dirname, '..','..', 'uploads')));
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
// npm i --save-dev @types/cookie-parser
