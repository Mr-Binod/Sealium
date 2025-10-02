import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Did {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;




}
