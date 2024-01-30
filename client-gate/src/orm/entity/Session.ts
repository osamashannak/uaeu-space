import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {User} from "./User";


@Entity()
export class Session {
    @PrimaryColumn()
    token!: string;

    @Column()
    ipAddress!: string;

    @ManyToOne(() => User, user => user.sessions)
    user!: User;

    @Column()
    userAgent!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}