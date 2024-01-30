import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Session} from "./Session";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    username!: string;

    @OneToMany(() => Session, userSession => userSession.user)
    sessions!: Session[];

    @Column({default: null, nullable: true, unique: true})
    googleId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @CreateDateColumn()
    updatedAt!: Date;

}