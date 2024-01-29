import {
    ChildEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance
} from "typeorm";
import {Session} from "./Session";


@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @CreateDateColumn()
    updatedAt!: Date;

}

@ChildEntity("registered")
export class RegisteredUser extends User {

    @Column({unique: true})
    username!: string;

    @OneToMany(() => Session, userSession => userSession.user)
    sessions!: Session[];

    @Column({default: null, nullable: true, unique: true})
    googleId!: string;

}

@ChildEntity("guest")
export class Guest extends User {

    @Column({unique: true})
    token!: string;

    @Column()
    ipAddress!: string;

    @Column()
    userAgent!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @CreateDateColumn()
    updatedAt!: Date;

}