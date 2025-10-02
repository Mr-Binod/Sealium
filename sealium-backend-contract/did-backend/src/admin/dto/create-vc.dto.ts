import { IsString } from "class-validator";

export class CreateVcDTO {
    @IsString()
    userName : string;

    @IsString()
    userId : string;

    @IsString()
    certificateName : string;
    
    @IsString()
    requestDate : string;

    @IsString()
    description : string;

    @IsString()
    request : string;

    @IsString()
    status : string;

    @IsString()
    issuerId : string;


    @IsString()
    ImagePath: string;

    @IsString()
    DOB : string;
}
