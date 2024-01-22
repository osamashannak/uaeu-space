import {Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {User} from "./User";


@Entity()
export class UserPassword {

    @PrimaryColumn({type: "uuid"})
    salt!: string;

    @Column()
    hash!: string;

    @OneToOne(() => User, user => user.password)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}