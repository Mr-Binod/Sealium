import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DidModule } from './did/did.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { KakaoAuthModule } from './kakao-auth/kakao-auth.module';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    DidModule,
    DatabaseModule,
    KakaoAuthModule,
    AdminModule,
    ClientModule,
    WebsocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


