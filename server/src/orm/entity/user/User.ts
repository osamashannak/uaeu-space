import {Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserAction} from "./UserAction";
import {UserPassword} from "./UserPassword";
import {Review} from "../Review";
import {CourseFile} from "../CourseFile";
import {Rating} from "../Rating";
import {UserSession} from "./UserSession";
import {Guest} from "./Guest";


@Entity()
export class User extends Guest {

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    verified!: boolean;

    @OneToOne(() => UserPassword, userPassword => userPassword.user)
    password!: UserPassword;

    @Column({nullable: true})
    googleId!: string;

}