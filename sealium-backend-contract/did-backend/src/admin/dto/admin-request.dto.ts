import { IsString } from "class-validator";
import { admin } from "src/database/schema";

export class AdminRequestDto {
    userId : string;
    userName : string;
    password : string;
    nickName : string;
    birthDate : string;
    
    // grade : number;
    imgPath : string;
}
