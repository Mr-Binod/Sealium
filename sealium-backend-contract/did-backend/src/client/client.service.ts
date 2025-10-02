import { Inject, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { and, eq } from 'drizzle-orm';
import { DidService } from 'src/did/did.service';
import { CreateVcRequestDTO } from 'src/admin/dto/create-vc-request.dto';

@Injectable()
export class ClientService {

  private delay : (ms : number) => Promise<void>;
  constructor(
    private didService: DidService,
    @Inject('DATABASE') private db: NodePgDatabase<typeof schema>,
  ) {
	    this.delay = (ms : number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
  }

  async createVcRequest(
    createVcRequestDTO: CreateVcRequestDTO
  ) {
    const data = await this.db.insert(schema.vc_request_logs).values(createVcRequestDTO).returning();
    return {state : 200, message : 'VC request created', data};
  }

  async findAllUserVc(id : string) {
    // let uservc = []
    const data = await this.db.select().from(schema.user_vc).where(eq(schema.user_vc.userId, id))
    console.log(data, 'data')
    const VCdata = data.map(async (item) => {
      const VC = await this.didService.getVC( item.userDidId, item.certificateName, item.userId)
      
      return VC
    })
    const newVcData = await Promise.all(VCdata)
    console.log(newVcData, 'newVcData')
    return newVcData;
  }
  
  async findUserPendingVc(id: string) {
	  return await this.db.select().from(schema.vc_request_logs).where(eq(schema.vc_request_logs.userId, id))
  }


  async certRevokeReject( id : string, certname : string) {
	  const now = new Date();
  	await this.db.update(schema.vc_request_logs).set({ status : 'rejected', updatedAt : now}).where(and(eq(schema.vc_request_logs.userId, id),eq(schema.vc_request_logs.certificateName, certname)))
       return {state : 200, message : 'certrevokereject successful'}	
  }

  async certApproveReject(id : string, certname : string){
	  	const now = new Date();
	       await this.db.update(schema.vc_request_logs).set({status : 'approved', updatedAt : now}).where(and(eq(schema.vc_request_logs.userId, id),eq(schema.vc_request_logs.certificateName, certname)))
	      console.log(id, certname, 'cert')
	await this.didService.removeVc(id, certname);
       return {state : 200, message : 'certApproveReject successful'}
  }
  async certIssueReject(id : string, certname : string) {
	  const now = new Date()
	              await this.db.update(schema.vc_request_logs).set({updatedAt : now , status : 'rejected'}).where(and(eq(schema.vc_request_logs.userId, id),eq(schema.vc_request_logs.certificateName, certname)))
       return {state : 200, message : 'certApproveReject successful'}
  }

  async userLoginStats(id : string) {
	  await this.db.insert(schema.userLoginStats).values({
		  userId : id})
		  return{ state : 200, message : 'user loginstats inserted'}
  }
  async getUserLoginStats(){
	  return await this.db.select().from(schema.userLoginStats)
  }
	
  async UpdateLogin(id : string){
	  const now = new Date()
	  return await this.db.update(schema.user).set({updatedAt : now}).where(eq(schema.user.userId, id))
  }


  async findAll() {
    const data = await this.db.select().from(schema.user)
    console.log(data, 'data')
    if(data.length === 0){
      return {state : 404, message : 'no users'};
    }
    return {state : 200, message : 'users found', data : data};
  }

  async findOne(id: string) {
    console.log(id, 'id')
    const data = await this.db.select().from(schema.user).where(eq(schema.user.userId, id))
    console.log(data, 'data')
    if(data.length === 0){
      return {state : 404, message : 'no user'};
    }
    return {state : 200, message : 'user found', data : data};
  }

  async updateUserInfo(id: string, updateClientDto: UpdateClientDto) {
	  try{
	  const data = await this.db.update(schema.user).set(updateClientDto).where(eq(schema.user.userId , id)).returning()
    		return {state  :200, message : 'update successful', data}
	  } catch {
		  return {state : 405, message : 'update error'}
	  }
  }
  
  async remove(id: string) {
    
    return this.didService.removeUser(id);
  }

  removevc(id: string, vc: string) {
    return this.didService.removeVc(id, vc);
  }
}
