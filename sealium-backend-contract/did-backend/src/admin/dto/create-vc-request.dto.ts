import { IsString } from "class-validator";

export class CreateVcRequestDTO {
    @IsString()
    userName : string;

    @IsString()
    userId : string;

    @IsString()
    certificateName : string;

    @IsString()
    description : string;

    @IsString()
    request : string;

    @IsString()
    status : string;

    @IsString()
    DOB : string;

    @IsString()
    ImagePath: string;
}
