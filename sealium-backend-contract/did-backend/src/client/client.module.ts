import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { DidService } from 'src/did/did.service';
import { CertificateService } from 'src/did/certificate.service';

@Module({
  controllers: [ClientController],
  providers: [ClientService, DidService, CertificateService],
})
export class ClientModule {}
