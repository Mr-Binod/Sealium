import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsString } from 'class-validator';

export class UpdateClientDto {
	
    @IsString()
    nickName: string;

    @IsString()
    address: string;

    @IsString()
    imgPath: string;
}
