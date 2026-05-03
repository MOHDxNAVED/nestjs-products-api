import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./roles.enum";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    name:string

    @Column({unique:true})
    email:string

    @Column()
    password:string

    @Column({default:Role.USER})
    role:string

    @CreateDateColumn()
    createdAt:Date

}