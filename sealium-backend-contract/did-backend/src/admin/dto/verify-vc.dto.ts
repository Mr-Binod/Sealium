import { IsString } from "class-validator";

export class VerifyVcDTO {
    @IsString()
    userDidId : string;

    @IsString()
    urlLink : string;
}