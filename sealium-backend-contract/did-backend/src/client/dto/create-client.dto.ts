import { IsNumber, IsString } from "class-validator";

export class CreateClientDto {
        @IsString()
        userId : string;

        @IsString()
        userName : string;

        @IsString()
        nickName : string;

        @IsString()
        password : string;

        @IsString()
        address : string;

        @IsString()
        imgPath : string;

        @IsString()
        birthDate : string;
}
