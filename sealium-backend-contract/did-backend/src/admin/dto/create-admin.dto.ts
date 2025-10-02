import { IsNumber, IsString } from "class-validator";

export class CreateAdminDto {

    @IsString()
    userId : string;

    @IsString()
    userName : string;

    @IsString()
    password : string;

    @IsString()
    nickName : string;

    @IsString()
    birthDate : string;

    @IsString()
    imgPath : string;

  //  @IsString()
//    phoneNumber : string;
 
    // @IsNumber()
    // grade : number;
}
