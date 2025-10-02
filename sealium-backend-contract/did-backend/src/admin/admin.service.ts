import { Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateVcDTO } from './dto/create-vc.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { Admin } from 'typeorm';
import { AdminRequestDto } from './dto/admin-request.dto';
import { stat } from 'fs';
import * as bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';

@Injectable()
export class AdminService {

  private jwtSecretKey : string;

  constructor(
    private configService: ConfigService,
    @Inject('DATABASE') private db: NodePgDatabase<typeof schema>,
  ){ 
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY') as string;
  }

  // createvc(createVcDTO: CreateVcDTO) {
  //   const userdata = this.db.select().from(schema.user).where(eq(schema.user.userId, createVcDTO.userId));
  //   const issuerdata = this.db.select().from(schema.user).where(eq(schema.admin.adminId, createVcDTO.issuerId));

  //   console.log(userdata, issuerdata, 'userdata');

  //   // const userdidAddress = 
  //   // const userdid = 
  //   return 'This action adds a new admin';
  // }

  async savetempadmin(adminRequestDto : AdminRequestDto){ 
      // const {userId, userName, nickName, password, birthDate, phoneNumber, grade, imgPath } = adminRequestDto
	const bcryptToken = await bcrypt.hash(adminRequestDto.password, 10)
        adminRequestDto.password = bcryptToken;
      const data = await this.db.insert(schema.admin_request).values(adminRequestDto).returning();
      return {state : 200, message : 'admin request saved', data};
    }


  async findAll() {
    const alladmins = await this.db.select().from(schema.admin)
    return {state : 200, message : 'admins found', data : alladmins};
  }

  async findavailableId(id: string) {
    const admin = await this.db.select().from(schema.admin).leftJoin(schema.admin_request, eq(schema.admin.userId, schema.admin_request.userId)).where(eq(schema.admin.userId, id));
    console.log(admin, 'adminfindone');
    if(admin.length === 0){
      return {state : 404, message : 'no admin'};
    }
    return {state : 200, message : 'admin found', data : admin};
  }
   async findOne(id: string) {
    const admin = await this.db.select().from(schema.admin).where(eq(schema.admin.userId, id));
    console.log(admin, 'adminfindone');
    if(admin.length === 0){
      return {state : 404, message : 'no admin'};
    }
    return {state : 200, message : 'admin found', data : admin};
  }
async  update(id : string, updateAdminDto: UpdateAdminDto) {
	try{	 
       	const data = await this.db.update(schema.admin).set(updateAdminDto).where(eq(schema.admin.userId, id)).returning()
	console.log(data, 'updated data')
    	return {status : 200, message : 'admin info update successful', data}
	}catch {
		return {status : 402, message : 'admin info update failed'}
  }

}
  async pendingAdmins(){
	const items = await this.db.select().from(schema.admin_request)
	return {state : 200, message : 'pending admins request successful', data : items}
  }
 async rejectAdmin(id : string) {
	 const userInfo = await this.db.select().from(schema.admin_request).where(eq(schema.admin_request.userId, id));
	 if(userInfo.length < 1) return {state : 403, message : 'no pending user'}
	 const inputData = userInfo![0]
	 inputData.grade = 10 
	 await this.db.delete(schema.admin_request).where(eq(schema.admin_request.userId, id))
	 await this.db.insert(schema.admin_rejected).values(inputData)
	 return {state : 200, message : 'reject successful'}
	}
async getAllRejectedAdmins() {
	const admins = await this.db.select().from(schema.admin_rejected)
	return {state : 200, message : 'rejected admins request successful', data : admins}
}
async getAllAdminsTotalNum() {
	const admins = await this.db.select().from(schema.admin)
	const pendingAdmins = await this.db.select().from(schema.admin_request)
	const rejectedAdmins = await this.db.select().from(schema.admin_rejected)

	return {Totaladmins : admins.length, TotalPendingAdmins : pendingAdmins.length, TotalRejectedAdmins : rejectedAdmins.length}
}

async gatAllVcInfo(){
	try{
	//	const approvedVc = await this.db.select().from(schema.user_vc)
		const otherVc = await this.db.select().from(schema.vc_request_logs)
		return{state : 200, message : 'request successful', data : [ ...otherVc]}

	}catch {
		return{state : 403, message : 'request failed'}
	}
}


async getTotalUnA() {
	const admins = await this.db.select().from(schema.admin)
	const users = await this.db.select().from(schema.user)
	return { state : 200, message : 'getTotalUnA successful', TotalAdmins : admins.length, TotalUsers : users.length}
}
async getVcRequests() {
	try{
	const VcRequests = await this.db.select().from(schema.vc_request_logs)
	return {state : 200, message : 'vcrequest successful', data : VcRequests}
	}
	catch {
		return {state : 403, message : 'vcrequest failed'}
	}
}	

async remove(id: string) {
    const admin = await this.db.delete(schema.admin).where(eq(schema.admin.userId, id));
    console.log(admin, 'admindeleted');
    return {state : 200, message : 'admin deleted'};
  } 
}
