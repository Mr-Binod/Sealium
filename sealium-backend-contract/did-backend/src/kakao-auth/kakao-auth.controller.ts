import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Redirect, Query, Req} from '@nestjs/common';
import { KakaoAuthService } from './kakao-auth.service';
import { CreateKakaoAuthDto } from './dto/create-kakao-auth.dto';
import { UpdateKakaoAuthDto } from './dto/update-kakao-auth.dto';
import type { Response, Request } from 'express';
import { log } from 'console';
import { AdditionalInfoDto } from './dto/Additional-info.dto';
import { url } from 'inspector';

@Controller()
export class KakaoAuthController {
  constructor(private readonly kakaoAuthService: KakaoAuthService) {}

  @Post('kakao/register')
  create(
    @Body() additionalInfoDto : AdditionalInfoDto,
    @Req() req: Request 
  ) {
    const loginAccessToken : string = req.cookies['login_access_token'];
    const kakaoAccessToken : string = req.cookies['kakao_access_token'];
    
    console.log(loginAccessToken, kakaoAccessToken)
    return this.kakaoAuthService.create(loginAccessToken, additionalInfoDto);
  }
  
  @Get('kakao/auth')
  @Redirect()
  kakaoAuth() {
    const kakaoAuth = this.kakaoAuthService.kakaoAuth();
    return {url : kakaoAuth}
  }

  @Get('/auth/kakao/callback')
  @Redirect()
  async kakaoAuthCallback(
    @Res({passthrough : true}) res: Response,
    
    @Query() data : {code : string}) {
      console.log(data)
      const code : string = data.code
      const {token, access_token} = await this.kakaoAuthService.kakaoAuthCallback(code);
      res.cookie('login_access_token', token, {
  	httpOnly: true,
  	secure: true, // HTTPS 필수
  	sameSite: 'none', // cross-site 허용
  	domain: '.sealiumback.store', // 모든 서브도메인에서 공유
  	maxAge: 10 * 60 * 60 * 1000,
}     );
      res.header('login_access_token', token.toString())
      return{url : "https://sealiumback.store/signup/did"}
  
  }

  @Get('kakao/logout')
  @Redirect()
  logout(){
    return {url : this.kakaoAuthService.logout()}
  }

  @Get('/auth/kakao/logout/callback')
  @Redirect()
  kakaoLogoutCallback(
    @Res({passthrough : true}) res: Response
  ){
    res.clearCookie('login_access_token', { 
	  httpOnly: true,
	  secure: true,
	  sameSite: 'none',
	  domain: '.sealiumback.store',
	  path: '/',
	});
    return {url : 'https://sealiumback.store'}
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kakaoAuthService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKakaoAuthDto: UpdateKakaoAuthDto) {
    return this.kakaoAuthService.update(+id, updateKakaoAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kakaoAuthService.remove(+id);
  }
}
