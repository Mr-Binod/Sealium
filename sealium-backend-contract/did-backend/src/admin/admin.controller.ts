import { Redirect, Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateVcDTO } from './dto/create-vc.dto';
import { DidService } from 'src/did/did.service';
import { CreateDidDto } from 'src/did/dto/create-did.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import * as bcrypt from 'bcrypt';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly didService: DidService,
    private readonly adminService: AdminService,
    private readonly configService: ConfigService
  ) { }

  @Post()
  createadmin(@Body() _data: CreateAdminDto) {
    console.log(_data, 'dataadmin');
    return this.didService.createadmin(_data);
  }

  @Post('request')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const safeName = Buffer.from(file.originalname, "latin1").toString(
          "utf8"
        );
        const parsed = path.parse(safeName);
        cb(null, `${parsed.name}_${Date.now()}${parsed.ext}`);
      },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
  }))
  savetempadmin(
    @UploadedFile() file: Express.Multer.File,
    @Body() _data: CreateAdminDto
  ) {
    _data.imgPath = `https://api.sealiumback.store/uploads/${file.filename}`;
    return this.adminService.savetempadmin(_data);
  }

  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body() _data: { userId: string, password: string }) {
    const data = await this.adminService.findOne(_data.userId)
    const jwtSecretKey: string = this.configService.get<string>('JWT_SECRET_KEY') as string;
    if (data.state !== 200) return { state: 403, message: '아이디와 비밀번호가 일치하지  않습니다' }
    const verifypwd = await bcrypt.compare(_data.password, data.data![0].password)
    if (!verifypwd) return ({ state: 403, message: '아이디와 비밀번호가 일치하지 않습니다' })

    const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1d' })
    res.cookie('admin_access_token', token, {
      httpOnly: true,
      secure: true, // HTTPS 필수
      sameSite: 'none', // cross-site 허용
      domain: '.sealiumback.store', // 모든 서브도메인에서 공유
      maxAge: 10 * 60 * 60 * 1000,
    });


    return ({ state: 200, message: '로그인 성공했습니다', data })
  }


  @Get('oauth')
  async Oauth(
    @Req() req: Request) {
    const jwtSecretKey: string = this.configService.get<string>('JWT_SECRET_KEY') as string;
    const adminAccessToken: string = req.cookies['admin_access_token'];

    const data: any = await jwt.verify(adminAccessToken, jwtSecretKey)
    console.log(data, 'tokendata')
    return data
  }

  @Get('superadmin')
  async GetsuperAdmin() {
    const SuperAdminPwd = await bcrypt.hash('admin123@', 10)
    return (SuperAdminPwd)
  }

  @Get('admins')
  findAll() {
    return this.adminService.findAll();
  }

  @Get('logout')
  // @Redirect()
  userLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('admin_access_token', {
      path: '/',
      domain: '.sealiumback.store'
    })
    return {state : 200, message : 'admin logout successful'}
  }

  @Get('pendingadmins')
  pendingAdmins() {
    return this.adminService.pendingAdmins();
  }

  @Delete('rejectadmin')
  rejectAdmin(@Body('userId') userId: string) {
    console.log(userId, 'rejectid')
    return this.adminService.rejectAdmin(userId)
  }


  @Get('getallvcinfo')
  gatAllVcInfo() {
    return this.adminService.gatAllVcInfo()
  }

  @Get('rejectedadmins')
  getAllRejectedAdmins() {
    return this.adminService.getAllRejectedAdmins()
  }

  @Get('getalladminstotalnum')
  getAllAdminsTotalNum() {
    return this.adminService.getAllAdminsTotalNum()
  }
  @Get('gettotaluna')
  getTotalUnA() {
    return this.adminService.getTotalUnA()
  }

  @Get('vcrequestlogs')
  getVcRqeusts() {
    return this.adminService.getVcRequests()
  }
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
  @Get('availableid/:id')
  findavailableId(@Param('id') id: string) {
    return this.adminService.findavailableId(id)
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const safeName = Buffer.from(file.originalname, "latin1").toString(
          "utf8"
        );
        const parsed = path.parse(safeName);
        cb(null, `${parsed.name.slice(0, 15)}_${Date.now()}${parsed.ext}`);
      },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
  }))
  async update(@UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    const jwtSecretKey: string = this.configService.get<string>('JWT_SECRET_KEY') as string;

    updateAdminDto.imgPath = `https://api.sealiumback.store/uploads/${file.filename}`;
    const response = await this.adminService.update(id, updateAdminDto);
    console.log(response, ' admin response')
    if (response.data) {
      const token = jwt.sign(response.data[0], jwtSecretKey, { expiresIn: '1d' })
      await res.clearCookie('admin_access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.sealiumback.store',
        path: '/',
      })
      res.cookie('admin_access_token', token, {
        httpOnly: true,
        secure: true, // HTTPS 필수
        sameSite: 'none', // cross-site 허용
        domain: '.sealiumback.store', // 모든 서브도메인에서 공유
        maxAge: 10 * 60 * 60 * 1000,
      });
      return response
    }
    return response


  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
