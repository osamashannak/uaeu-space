import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {RegisteredUser} from "./User";


@Entity()
export class Session {
    @PrimaryColumn()
    token!: string;

    @Column()
    ipAddress!: string;

    @ManyToOne(() => RegisteredUser, user => user.sessions)
    user!: RegisteredUser;

    @Column()
    userAgent!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @CreateDateColumn()
    updatedAt!: Date;

}