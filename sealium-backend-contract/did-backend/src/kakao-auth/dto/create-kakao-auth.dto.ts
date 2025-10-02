import { IsString } from "class-validator";

export class CreateKakaoAuthDto {
    @IsString()
    id : string;

    @IsString()
    nickname : string;

    @IsString()
    profile_image : string;
}
