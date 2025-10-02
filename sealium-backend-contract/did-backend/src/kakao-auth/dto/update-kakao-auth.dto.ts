import { PartialType } from '@nestjs/mapped-types';
import { CreateKakaoAuthDto } from './create-kakao-auth.dto';

export class UpdateKakaoAuthDto extends PartialType(CreateKakaoAuthDto) {
    
}
