import { createJWT } from "did-jwt";
import { createVerifiableCredentialJwt, Issuer, verifyCredential } from "did-jwt-vc";
import { Resolver } from "did-resolver";
import { ethers } from "ethers";
import { EthrDID } from "ethr-did";
import { CreateVcDTO } from "src/admin/dto/create-vc.dto";

export const CreateVC = async (createVcDTO: CreateVcDTO, userDid: EthrDID, issuerDid: EthrDID) => {
    console.log(userDid, 'didcreate');

    const vcPayload = {
        sub: userDid.did,
        nbf: Math.floor(Date.now() / 1000),
        issuer: issuerDid.did,
        issuseDate: new Date().toISOString(),
        vc: {
            "@context": ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential', 'YourCustomType'],
            credentialSubject: {
                userDid: userDid.did,
                ...createVcDTO,
                issuer: 'kyungilgameIT academy'
            }
        }
    }
    
    const JWT = await createVerifiableCredentialJwt(vcPayload, userDid as unknown as Issuer)
    console.log(JWT, vcPayload, 'vcPayload');
    // console.log(did, 'createvcdid')
    
    return JWT;
}



