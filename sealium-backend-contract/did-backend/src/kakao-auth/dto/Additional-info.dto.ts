import { IsString } from "class-validator";

export class AdditionalInfoDto {

    @IsString()
    userName: string;

    @IsString()
    birthDate: string;

    @IsString()
    address: string;

    @IsString()
    imgPath: string;

}

