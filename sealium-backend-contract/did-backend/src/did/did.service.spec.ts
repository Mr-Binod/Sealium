// import { Test, TestingModule } from "@nestjs/testing";
// import { DidService } from "./did.service";
// import { ConfigModule, ConfigService } from "@nestjs/config";
// import { CertificateService } from "./certificate.service";
// import { EthrDID } from "ethr-did";
// import { DatabaseModule } from "../database/database.module"
// import axios from "axios";
// import { user } from "src/database/schema";

// describe('DidService', () => {
//     let service: DidService;
//     let certificateService: CertificateService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             imports: [ConfigModule.forRoot({envFilePath : '.env'}), DatabaseModule],
//             providers: [
//                 DidService,
//                 CertificateService,
//                 ConfigService,
//             ],
//         }).compile();

//         service = module.get<DidService>(DidService);
//         certificateService = module.get<CertificateService>(CertificateService);
//     });
    

//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });

//     let userDidId :string;
//     let issuserDidId : string;
//     let userWalletAddress : string;

//     describe('create', () => {

//         function delay(ms) {
//             return new Promise(resolve => setTimeout(resolve, ms));
//         }

//         it('should create a admindid', async () => {

//             const Userdid = await service.createadmin({
//                 userName: 'admin',
//                 userId: 'admin7w12',
//                 nickName: 'admin',
//                 password: 'admin',
//                 birthDate: '123123',
//                 address: 'admin',
//                 imgPath: 'admin',
                
//             });
//             expect(Userdid).toBeDefined();
//             issuserDidId=Userdid.data[0].didAddress;
//             console.log(Userdid, 'createadmindid')
//         },10000)


//         it('should create a did', async () => {
//             const Userdid = await service.create({
//                 userName: 'test3',
//                 userId: 'hey3w121',
//                 nickName: 'test3',
//                 password: 'test3',
//                 birthDate: '123123',
//                 address: 'test3',
//                 imgPath: 'test3',
                
//             });
//             expect(Userdid).toBeDefined();
//             userDidId=Userdid.data[0].didAddress;
//             userWalletAddress=Userdid.data[0].walletAddress;
//             console.log(Userdid, 'createdid')
//         }, 10000)

//         // it('should register kakaouser', async() => {
//         //     await delay(9000)

//         //     const data = {
//         //         userName: 'kakao12',
//         //         birthDate: 'kakaodate',
//         //         address: 'kakaoaddress',
//         //         imgPath: 'kakaoimgpath'
//         //     }
//         //     const register = await axios.post('http://localhost:4000/kakao/register', data);
//         //     expect(register).toBeDefined()
//         //     console.log(register, 'kakaoregister');  
//         // }, 10000)

//         it('should create vc', async() => {
//             await delay(9000)

//             const data = {
//                 userId: 'hey3w121',
//                 userName: 'createvcdate',
//                 certificateName: 'createvcaddress',
//                 issueDate: 'createvcimgpath',
//                 event:'createvc',
//                 description: 'dfdfwev',
//                 issuerId: 'admin7w12'
//             }
//             const register = await axios.post('http://localhost:4000/createvc', data);
//             expect(register).toBeDefined()

//             console.log(register, 'dataregister');
                
//         }, 10000)

//         it('should return userdid', async() => {
//             const data = await service.getUser('hey1')
//             console.log(data)
//         })

//         // it('should verify vc', async() => {
//         //     const data = {'did:ethr:sealium:0x9DcE1891CCa7Db157a184CFCA4947c8778DCbBf1', 'http://localhost:3000/'}
//         //     const register = await axios.post('http://localhost:4000/verifyvc', data);

//         // })


//         //     await delay(5000)

//         //     const Issuerdid = await service.createadmin({
//         //         adminid: 'test23',
//         //         domain: 'test2',
//         //         // salt: 'test2'
//         //     });
//         //     expect(Issuerdid).toBeDefined();
            
//         //     console.log(Userdid, 'test');
//         //     const createVc = await service.createvc({ // Remove this line
//         //         userdid: Userdid,
//         //         name: 'test',
//         //         type: 'test',
//         //         issuerdid: Issuerdid
//         //     });

//         //     // console.log(createVc, 'createVc');

//         //     // const result2 = await service.verifyvc(result1, result.did.did);
//         //     // console.log(result2, 'test22');
//         // }, 300000);
//     });

//     // describe('createvc', () => {
//     //     it('should create a vc', async () => {
//     //         const result = await service.createvc({
//     //             name: 'test',
//     //             type: 'test',
//     //             issuer: 'test'
//     //         });
//     //         console.log(result, 'test11');
//     //     });
//     // });
// });