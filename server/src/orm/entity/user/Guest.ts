import {CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserAction} from "./UserAction";
import {UserSession} from "./UserSession";
import {Review} from "../Review";
import {CourseFile} from "../CourseFile";
import {Rating} from "../Rating";


@Entity()
export class Guest {

    @PrimaryGeneratedColumn("uuid")
    uuid!: string;

    @OneToMany(() => UserAction, userAction => userAction.user)
    actionHistory!: UserAction[];

    @OneToMany(() => UserSession, userSession => userSession.user)
    sessions!: UserSession[];

    @OneToMany(() => Review, review => review.user)
    reviews!: Review[];

    @OneToMany(() => CourseFile, courseFile => courseFile.user)
    courseFiles!: CourseFile[];

    @OneToMany(() => Rating, rating => rating.user)
    ratings!: Rating[];

    @CreateDateColumn()
    createdAt!: Date;

    @CreateDateColumn()
    updatedAt!: Date;

}
