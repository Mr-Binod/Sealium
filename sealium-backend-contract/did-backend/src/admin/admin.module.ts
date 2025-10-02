import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DidService } from 'src/did/did.service';
import { CertificateService } from 'src/did/certificate.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, DidService, CertificateService],
})
export class AdminModule {}
