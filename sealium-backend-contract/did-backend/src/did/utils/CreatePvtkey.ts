import { keccak256, solidityPacked } from "ethers";
import * as dotenv from 'dotenv';
import { PrivateKeyDto } from "../dto/privateKey.dto";

dotenv.config();

export const CreatePvtKey = (data : PrivateKeyDto) => {
    const salt = process.env.SALT;
    console.log(salt, 'salt');
    const idKey = `${data.id}`;  
    const value = solidityPacked(['string', 'string'], [salt, idKey ]);
    const pvtkey = keccak256(value).replace('0x', '').slice(0, 64);
    return `0x${pvtkey}`;
}