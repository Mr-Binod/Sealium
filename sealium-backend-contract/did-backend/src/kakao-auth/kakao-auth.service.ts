import { Inject, Injectable } from '@nestjs/common';
import { CreateKakaoAuthDto } from './dto/create-kakao-auth.dto';
import { UpdateKakaoAuthDto } from './dto/update-kakao-auth.dto';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { DidService } from 'src/did/did.service';
import { CreatePvtKey } from 'src/did/utils/CreatePvtkey';
import { AdditionalInfoDto } from './dto/Additional-info.dto';


@Injectable()
export class KakaoAuthService {

  constructor(
    private readonly configService: ConfigService,
    private readonly didService: DidService,
    // @Inject('DATABASE') private db: NodePgDatabase<typeof schema>,
  ) { }

  create(loginAccessToken: string, additionalInfoDto: AdditionalInfoDto) {
    const jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY') as string;
    console.log(loginAccessToken, jwtSecretKey, 'dd')
    const decoded: any = jwt.verify(loginAccessToken, jwtSecretKey)
    console.log(decoded, 'decoded')
    const { id, properties } = decoded;
    const { nickname, profile_image } = properties
    const pvtkey = CreatePvtKey(id)
    const data: CreateKakaoAuthDto = { id, nickname, profile_image }
    // const userDid =
    this.didService.CreateKakaoUser(data, additionalInfoDto)
    return
  }

  kakaoAuth() {
    const KakaoClientId = this.configService.get<string>('KAKAO_CLIENT_ID') as string;
    const RedirectUrl = this.configService.get<string>('REDIRECT_URL') as string;
    console.log(RedirectUrl, 'redirecturl11')
    const kakaoAuth = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KakaoClientId}&redirect_uri=${RedirectUrl}`
    console.log(kakaoAuth, 'kakaoAuth')
    return kakaoAuth
  }

  async kakaoAuthCallback(code: string) {
    const TokenUrl = this.configService.get<string>('TOKEN_URL') as string;
    const jwtkey = this.configService.get<string>('JWT_SECRET_KEY') as string;
    console.log(TokenUrl, jwtkey)
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_CLIENT_ID') as string,
      redirect_uri: this.configService.get<string>('REDIRECT_URL') as string,
      code,
      client_secret: this.configService.get<string>('CLIENT_SECRET') as string,
    })

    console.log(data, 'data')
    const response = await axios.post(TokenUrl, data, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })

    console.log(response, 'response')
    const { access_token } = response.data;
    const { data: userData } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    const { id, properties } = userData;
    const token = jwt.sign({ id, properties }, jwtkey, { expiresIn: '1d' })
    console.log(token, 'token')
    return { token, access_token }
  }

  logout() {
    const redirect_kakao_logout = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${process.env.LOGOUT_REDIRECT_URL}`
    return redirect_kakao_logout;
  }

  findAll() {
    return `This action returns all kakaoAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kakaoAuth`;
  }

  update(id: number, updateKakaoAuthDto: UpdateKakaoAuthDto) {
    return `This action updates a #${id} kakaoAuth`;
  }

  remove(id: number) {
    return `This action removes a #${id} kakaoAuth`;
  }
}
