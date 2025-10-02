import { Injectable, Inject } from '@nestjs/common';
import { CreateDidDto } from './dto/create-did.dto';
import { UpdateDidDto } from './dto/update-did.dto';
import { CreatePvtKey } from './utils/CreatePvtkey';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { EthrDID } from 'ethr-did';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { and, eq } from 'drizzle-orm';
import { CreateVC } from './utils/CreateVC';
import { verifyVC } from './utils/VerifyVC';
import { CertificateService } from './certificate.service';
import * as jwt from 'jsonwebtoken';
import DidContractABI from '../abi/DidContract.json';
import { PrivateKeyDto } from './dto/privateKey.dto';
import { CreateKakaoAuthDto } from 'src/kakao-auth/dto/create-kakao-auth.dto';
import { AdditionalInfoDto } from 'src/kakao-auth/dto/Additional-info.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { CreateVcDTO } from 'src/admin/dto/create-vc.dto';
import { VerifyVcDTO } from 'src/admin/dto/verify-vc.dto';

@Injectable()
export class DidService {

  private provider : ethers.JsonRpcProvider;
  private Userdid : EthrDID;
  private Issuerdid : EthrDID;
  private userPvtKey : string;
  private issuerPvtKey : string;
  private jwtSecretKey : string; // Uncomment this line
  private DidContract : ethers.Contract;
  private delay : (ms : number) => Promise<void>;

  constructor(
    // private readonly db: NodePgDatabase<typeof schema>,
    private configService: ConfigService,
    private readonly certificateService : CertificateService,
    @Inject('DATABASE') private db: NodePgDatabase<typeof schema>,
    
  ){
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY') as string;
    this.provider = new ethers.JsonRpcProvider(this.configService.get<string>('RPC_URL'));
    const paymasterPvtKey : string = this.configService.get<string>('SEPOLIA_PAYMASTER_PVTKEY') as string;
    const DidContractAddress : string = this.configService.get<string>('DID_CONTRACT_ADDRESS') as string;
    const PaymasterWallet = new ethers.Wallet(paymasterPvtKey, this.provider);
    this.DidContract = new ethers.Contract(DidContractAddress, DidContractABI.abi, PaymasterWallet);
      this.delay = (ms : number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
  }
 
  async CreateKakaoUser(_data : CreateKakaoAuthDto, additionalInfoDto : AdditionalInfoDto) {
    const {id, nickname, profile_image} = _data;
    const {userName, birthDate, address} = additionalInfoDto;
    const pvtkey : string = CreatePvtKey({id})
    const wallet : ethers.Wallet= new ethers.Wallet(pvtkey, this.provider);
    const _address = wallet.address;

    const Userdid = new EthrDID({
      identifier: _address,
      privateKey: pvtkey,
      chainNameOrId: 'sealium'
    });

    const didAddress = Userdid.did;
    const HashWalletData = jwt.sign({address : _address, privateKey : pvtkey}, this.jwtSecretKey)
    const SetWalletData = await this.DidContract.setWalletData(_address, didAddress, HashWalletData);
    await SetWalletData.wait();

    //await this.delay(5000)
    // const HashUserDid = jwt.sign(this.Userdid, this.jwtSecretKey)
    //const SetDidData = await this.DidContract.setDidData(didAddress, HashWalletData);
    //await SetDidData.wait();

    const ContractDidData = await this.DidContract.DidData(_address);
    console.log(ContractDidData, 'contractdiddata')

    const Data = await this.db.insert(schema.user).values({
        userName : userName,
        userId : id,
        nickName : nickname,
        birthDate : birthDate,
        address,
        imgPath : profile_image,
        walletAddress : _address,
        didAddress : Userdid.did,
    }).returning()

    console.log(Data, 'data')
    return {state : 200, message : 'signup successful'}
  }

  async create(createDidDto: CreateDidDto) {
    const {userId, userName, nickName, password, birthDate, address, imgPath } = createDidDto
    const _data : PrivateKeyDto = {id : userId}
    const pvtkey = CreatePvtKey(_data);
    const wallet : ethers.Wallet= new ethers.Wallet(pvtkey, this.provider);
    const _address = wallet.address;
    this.userPvtKey = pvtkey;
    
    const Userdid = new EthrDID({
      identifier: _address,
      privateKey: pvtkey,
      chainNameOrId: 'sealium'
    });

    const didAddress = Userdid.did;

    const HashWalletData = jwt.sign({userAddress : _address, userPvtKey : pvtkey}, this.jwtSecretKey)
    const SetEoaData = await this.DidContract.setWalletData(_address, didAddress, HashWalletData);
    await SetEoaData.wait();

    //await this.delay(5000)
    //const setDidData = await this.DidContract.setDidData(didAddress, HashWalletData);
    //await setDidData.wait();
    //console.log(setDidData, 'setdiddata')
    const ContractDidData = await this.DidContract.WalletData(_address);
    console.log(ContractDidData, 'contractdiddata')
    
    const decoded = jwt.verify(ContractDidData, this.jwtSecretKey)
    // const events = await this.DidContract.on('EventSetWalletData', async(address, hashdata) => {
    //   console.log(address, hashdata, 'events')
    // })
    console.log(decoded, 'decoded')
    // const EoaData = await this.DidContract.WalletData(wallet.address);

    const Data = await this.db.insert(schema.user).values({
        userName ,
        userId ,
        nickName ,
        password,
        birthDate : birthDate,
        address,
        imgPath : imgPath,
        walletAddress : _address,
        didAddress : didAddress,
    }).returning()

    console.log(Data, 'data11')
    return {state : 200, message : 'signup successful', data : Data}
  }

  async createadmin(createAdminDto: CreateAdminDto) {
    console.log(createAdminDto, 'createAdminDto')
  const {userId, userName, nickName, password, birthDate,  imgPath } = createAdminDto

  const pvtkey : string = CreatePvtKey({id : userId});
  const wallet : ethers.Wallet = new ethers.Wallet(pvtkey, this.provider);
  const _address = wallet.address;
  // this.issuerPvtKey = pvtkey;
  
  const Issuerdid = new EthrDID({
    identifier: _address,
    privateKey: pvtkey,
    chainNameOrId: 'sealium'
  });
  // console.log('did', this.Issuerdid);

  const HashWalletData = jwt.sign({adminAddress : _address , adminPvtKey : pvtkey}, this.jwtSecretKey)
    // console.log(HashWalletData, 'hashwallet');
	
    const didAddress = Issuerdid.did
    const SetEoaData = await this.DidContract.setWalletData(_address, didAddress, HashWalletData);
    const receipt = await SetEoaData.wait()
    // console.log(receipt.status, 'seteoadataadmin')
    //     console.log(SetEoaData, 'seteoadataadmin')
    //     console.log(_address, 'addressadmin')
    
    //const didAddress = Issuerdid.did
    //const setDidData = await this.DidContract.setDidData(didAddress, HashWalletData);
    //await setDidData.wait();

    const EoaData = await this.DidContract.WalletData(_address);
    console.log(EoaData, 'eoadataadmin');
    const Data = await this.db.insert(schema.admin).values({
        ...createAdminDto,
        walletAddress : _address,
        didAddress : Issuerdid.did,
    }).returning()

    await this.db.delete(schema.admin_request).where(eq(schema.admin_request.userId, userId));
    console.log(Data, 'data11')
    return {state : 200, message : 'signup successful', data : Data}
  }


  

  // should be sent by admin
  async createvc(createVcDto: CreateVcDTO) {
    console.log(createVcDto, 'createvcDto')
    const userdata = await this.db.select().from(schema.user).where(eq(schema.user.userId, createVcDto.userId));
    const admindata = await this.db.select().from(schema.admin).where(eq(schema.admin.userId, createVcDto.issuerId));
    console.log(userdata, 'userdata')
    console.log(admindata, 'admindata')

    const userPublicKey = userdata[0].walletAddress;
    const userWalletData : string = await this.DidContract.WalletData(userPublicKey);
    const userData = jwt.verify(userWalletData, this.jwtSecretKey) as {userAddress : string, userPvtKey : string} ;
    const userDid = new EthrDID({
      identifier: userData.userAddress,
      privateKey: userData.userPvtKey,
      chainNameOrId: 'sealium'
    });
    
    const issuerPublicKey = admindata[0].walletAddress;
    const issuerWalletData : string = await this.DidContract.WalletData(issuerPublicKey);
    const issuerData = jwt.verify(issuerWalletData, this.jwtSecretKey) as {adminAddress : string, adminPvtKey : string};
    console.log(issuerData, 'issuerdata')
    const issuerDid = new EthrDID({
      identifier: issuerData.adminAddress,
      privateKey: issuerData.adminPvtKey,
      chainNameOrId: 'sealium'
    })
    await this.delay(5000)
    console.log(userData.userAddress, userData.userPvtKey, issuerData.adminAddress, issuerData.adminPvtKey, 'asdf')
    const VC = await CreateVC(createVcDto, userDid, issuerDid);
    // const HashVcData = jwt.sign({VC, issuerDidId : issuerDid.did}, this.jwtSecretKey);
    const SetVcData = await this.DidContract.setVcData(userDid.did, createVcDto.certificateName, VC);
    await SetVcData.wait();
    console.log(createVcDto)
    const VcConfirmedData = await this.db.insert(schema.vc_confirmed_logs).values(createVcDto).returning()
	
    const now = new Date();
    const data = await this.db.insert(schema.user_vc).values({
      userId: createVcDto.userId,
      userDidId: userDid.did,
      issuerId: createVcDto.issuerId,
      issuerDidId: issuerDid.did,
      certificateName: createVcDto.certificateName,
      status: createVcDto.status,
      description : createVcDto.description,
      ImagePath : createVcDto.ImagePath,
      DOB : createVcDto.DOB,
      updatedAt : now
    }).returning()

    await this.db.update(schema.vc_request_logs).set({status : createVcDto.status}).where(and(eq(schema.vc_request_logs.userId, createVcDto.userId),eq(schema.vc_request_logs.certificateName , createVcDto.certificateName)))
    // const certificate = await this.certificateService.generateCertificate(VC);
    // console.log(certificate, 'vc', VC);
    // const result = await verifyVC(VC, userDid, issuerDid, userData.privateKey, issuerData.privateKey);
    console.log(SetVcData, VC, 'resultvc', data);
    return {state : 200, message : 'vc created'}
  }

  async verifyvc(verifyVcDTO : VerifyVcDTO) {
    // const VC = await CreateVC(createVcDto.userdid, createVcDto.name, createVcDto.type, createVcDto.issuerdid);
    const url = verifyVcDTO.urlLink;
    const parts = url.split('/');
    const userId = parts[3]; // 'did:ethers:91283'
    const categoryValue = parts[4]; // 'categoryname'
    // console.log(didValue);
    // console.log(categoryValue);
    const UserData = await this.db.select().from(schema.user).where(and(eq(schema.user.userId, userId)));
    if(UserData.length < 1) return{state : 401, message : "verification failed"}
    const HashVcData = await this.DidContract.VcData(UserData![0].didAddress, categoryValue);
    console.log(HashVcData, 'hashvcdata')
    if(!HashVcData) return {state : 401, message : "verification failed"}
    // const decodedData = jwt.verify(HashVcData, this.jwtSecretKey) as { VC: string, issuerDidId: string };
    const VcData = await this.db.select().from(schema.user_vc).where(and(eq(schema.user_vc.userDidId, UserData![0].didAddress), eq(schema.user_vc.certificateName, categoryValue)));
    
    console.log(VcData, "vcdata")

    const userData = await this.DidContract.DidData(verifyVcDTO.userDidId);
    if(userData.length < 1 ) return {state : 401, message : "verification failed"}
    const verifiedUserData = jwt.verify(userData, this.jwtSecretKey) as {userAddress : string, userPvtKey : string};
    const {userAddress, userPvtKey} = verifiedUserData;
	console.log(VcData[0].issuerDidId, 'issuerdid')
    const issuerData = await this.DidContract.DidData(VcData[0].issuerDidId);
    if(issuerData.length < 1 ) return {state : 401, message : "verification failed"}
    const verifiedIssuerData = jwt.verify(issuerData, this.jwtSecretKey)  as { adminAddress: string, adminPvtKey: string };
    const {adminAddress, adminPvtKey} = verifiedIssuerData;
   
    console.log(HashVcData)
    console.log( verifyVcDTO.userDidId, VcData[0].issuerDidId, userPvtKey, adminPvtKey, "userdata", userData, "issuerData" , issuerData)
    const verifiedVC = await verifyVC(HashVcData, verifyVcDTO.userDidId, VcData[0].issuerDidId, userPvtKey, adminPvtKey);
    if(verifiedVC) {
      return {state : 200, message : verifiedVC};
    }
    return {state : 401, message : "verification failed"}
   }

  async getVC(userdidId : string, vcTitle : string, userId : string) {
    const VC = await this.DidContract.VcData(userdidId, vcTitle);
    const urlLink = `https://api.sealiumback.store/${userId}/${vcTitle}`

    const verifiedData = await this.verifyvc({userDidId: userdidId, urlLink} )
    console.log(VC,'vc',verifiedData)
    return verifiedData;
  }

    async getSingleVC(userdidId : string, vcTitle : string) {
    const VC = await this.DidContract.VcData(userdidId, vcTitle);
    return VC;
  }

  async getUser(userId : string) {
    const data = await this.db.select().from(schema.user).where(eq(schema.user.userId, userId));
    console.log(data, 'data');
    return data[0];
  }

  async removeVc(userId : string, vcTitle : string) {
    const userinfo = await this.getUser(userId)
    console.log(userinfo, userId, vcTitle, 'zzz')
    const data = await this.db.select().from(schema.user_vc).where(and(eq(schema.user_vc.userDidId, userinfo.didAddress), eq(schema.user_vc.certificateName, vcTitle)));
    const removeVc = await this.DidContract.removeVc(userinfo.didAddress, vcTitle);
    await removeVc.wait();
    return {state : 200, message : 'vc removed'}
  }

  async removeUser(userId : string) {
    const userVc = await this.db.select().from(schema.user_vc).where(eq(schema.user_vc.userId, userId));
    const userinfo = await this.getUser(userId)
    const removeUser = await this.DidContract.removeUser(userinfo.walletAddress, userinfo.didAddress);
    await removeUser.wait();
    //await this.delay(8000)
    //for(let i = 0; i < userVc.length; i++){
      //const removeVc = await this.DidContract.removeVc(userinfo.didAddress, userVc[i].certificateName);
      //await removeVc.wait();
     // await this.delay(8000)
   // }
   
    await this.db.delete(schema.user).where(eq(schema.user.userId, userId));
    return {state : 200, message : 'user removed'}
  }

 

  // async findAll() {
  //   const allDids = await this.db.select().from(schema.dids);
  //   return allDids;
  // }

  // async findOne(id: number) {
  //   const [did] = await this.db.select().from(schema.dids).where(eq(schema.dids.id, id));
  //   return did;
  // }

  // async update(id: number, updateDidDto: UpdateDidDto) {
  //   const [updatedDid] = await this.db
  //     .update(schema.dids)
  //     .set({
  //       domain: updateDidDto.domain,
  //       salt: updateDidDto.salt,
  //       updatedAt: new Date(),
  //     })
  //     .where(eq(schema.dids.id, id))
  //     .returning();
    
  //   return updatedDid;
  // }

 
  // async remove(id: number) {
  //   const [deletedDid] = await this.db
  //     .delete(schema.dids)
  //     .where(eq(schema.dids.id, id))
  //     .returning();
    
  //   return deletedDid;
  // }
}
