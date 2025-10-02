import { Module } from '@nestjs/common';
import { KakaoAuthService } from './kakao-auth.service';
import { KakaoAuthController } from './kakao-auth.controller';
import { DidService } from 'src/did/did.service';
import { CertificateService } from 'src/did/certificate.service';

@Module({
  controllers: [KakaoAuthController],
  providers: [KakaoAuthService, DidService, CertificateService],
})
export class KakaoAuthModule {}
