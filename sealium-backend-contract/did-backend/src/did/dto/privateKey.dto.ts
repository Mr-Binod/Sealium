import { IsString } from "class-validator";

export class PrivateKeyDto {
    @IsString()
    id: string;

}