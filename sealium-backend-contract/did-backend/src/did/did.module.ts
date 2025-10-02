import { Module } from '@nestjs/common';
import { DidService } from './did.service';
import { DidController } from './did.controller';
import { DatabaseModule } from '../database/database.module';
import { CertificateService } from './certificate.service';

@Module({
  imports: [DatabaseModule, ],
  controllers: [DidController],
  providers: [DidService, CertificateService],
})
export class DidModule {}
