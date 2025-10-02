import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DidService } from './did.service';
import { CreateDidDto } from './dto/create-did.dto';
import { UpdateDidDto } from './dto/update-did.dto';
import { CertificateService } from './certificate.service';
import type { Response } from 'express';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { CreateVcDTO } from 'src/admin/dto/create-vc.dto';
import { VerifyVcDTO } from 'src/admin/dto/verify-vc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import multer from 'multer';

@Controller()
export class DidController {
  constructor(
    private readonly didService: DidService,
    private readonly certificateService: CertificateService
  ) { }

//   @Post('user')
//   @UseInterceptors(FileInterceptor('file', {
//     storage: multer.diskStorage({
//       destination: './uploads',
//       filename: (req, file, cb) => {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//         cb(null, `${file.fieldname}-${uniqueSuffix}`);
//       }
//     })
//   }))
//   create(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() _data: CreateDidDto
// ) {
//     _data.imgPath = `http://sealiumback.store/uploads/${file.filename}`;
//     console.log(_data, 'data');
//     return this.didService.create(_data);
//   }

  // @Post('admin')
  // createadmin(@Body() _data: CreateDidDto) {
  //   return this.didService.createadmin(_data);
  // }

  @Post('verifyvc')
  verifyvc(
    @Body() _data: VerifyVcDTO
  ) {
    return this.didService.verifyvc(_data);
  }
  
  // @Post('createvc')
  // createvc(@Body() _data: CreateVcDTO) {
  //   const vc = this.didService.createvc(_data);
  //   return
  // }

  @Get('view/:userId/:vcTitle')
  async viewCertificate(
    @Param('userId') userId: string,
    @Param('vcTitle') vcTitle: string,
    @Res() res: Response,
  ) {
    const userdidId : string = (await this.didService.getUser(userId)).didAddress;
    const VC = await this.didService.getSingleVC(userdidId, vcTitle);
    const pdfBuffer = await this.certificateService.generateCertificate(VC);
    const filename = encodeURIComponent(`${name}_certificate.pdf`);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename*=UTF-8''${filename}`, // inline = open in browser
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDidDto: UpdateDidDto) {
  //   return this.didService.update(+id, updateDidDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.didService.remove(+id);
  // }
}
