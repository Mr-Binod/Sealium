import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userid: string;

    @Column()
    imgpath: string;

    @Column()
    issuer: string;

    @Column()
    phone: number;

    @Column()
    companyAddress: string;

    @Column()
    companyid: string;
}


