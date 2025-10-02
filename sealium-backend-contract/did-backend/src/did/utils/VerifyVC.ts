import { verifyCredential } from 'did-jwt-vc';
import { Resolver, ResolverRegistry } from 'did-resolver';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { EthrDID } from 'ethr-did';
import { computePublicKey } from '@ethersproject/signing-key';

dotenv.config();

export const verifyVC = async (JWT: string, userDidId: string, IssuerDidId : string, userPvtKey : string, issuerPvtKey : string) => {

    const SealiumRPC = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const blockNumber = await SealiumRPC.getBlockNumber();

    const buildEthrDIDDoc = (did: string, publicKey: string) => {
  // Create the DID document structure
        
        const didDocument = {
            '@context': 'https://www.w3.org/ns/did/v1',
            id: did, // DID identifier, e.g., 'did:ethr:sealium:0x14A7282aa2a5d68143738E0A8f435b81bfe769c5'
            publicKey: [
            {
                id: `${did}#keys-1`, // Public key ID (it references the DID and key identifier)
                type: 'Secp256k1VerificationKey2018', // Public key type (for Ethereum, Secp256k1 is common)
                controller: did, // DID this public key belongs to
                publicKeyHex: publicKey, // The actual public key in hexadecimal format
            },
            ],
            authentication: [
            {
                type: 'Secp256k1SignatureAuthentication2018', // Authentication method (using Secp256k1 signatures)
                publicKey: `${did}#keys-1`, // Reference to the public key in the document
            },
            ],
        };

        return didDocument;
    };

    // console.log(userDid.signer, 'signer')

    const issuerPublicKeyUncompressed = computePublicKey(issuerPvtKey, false).slice(2);
    const userPublicKeyUncompressed = computePublicKey(userPvtKey, false).slice(2);

    const issuerdDoc = buildEthrDIDDoc(IssuerDidId, issuerPublicKeyUncompressed);
    const userdDoc = buildEthrDIDDoc(userDidId, userPublicKeyUncompressed);

    const staticEthrResolver = async(did : string) => {
        const doc = did === IssuerDidId ? issuerdDoc : did === userDidId ? userdDoc : null
        if(!doc) {
            return {
                didResolutionMetadata: {error : 'notfound'},
                didDocument : null,
                didDocumentMetadata : {}
            }
        }
        return {
                didResolutionMetadata: {contentType : "application/did+json"},
                didDocument : doc,
                didDocumentMetadata : {}
            }
    }

    const resolver = new Resolver({
        ethr: async(userDidId : string) => staticEthrResolver(userDidId)
    } as ResolverRegistry)

    const verified = await verifyCredential(JWT, resolver);
    console.log('check', verified, 'verified')

    return verified
}








