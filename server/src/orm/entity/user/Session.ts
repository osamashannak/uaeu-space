import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Review} from "../professor/Review";
import {CourseFile} from "../CourseFile";
import {LegacyRating} from "../legacy/Rating";


@Entity()
export class Session {
    @PrimaryColumn()
    token!: string;

    @ManyToOne(() => User, user => user.sessions)
    user!: User;

    @Column()
    ipAddress!: string;

    @Column()
    userAgent!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @CreateDateColumn()
    updatedAt!: Date;

}

@Entity()
export class GuestSession extends Session {
    @OneToMany(() => Review, review => review.user)
    reviews!: Review[];

    @OneToMany(() => CourseFile, courseFile => courseFile.user)
    courseFiles!: CourseFile[];

    @OneToMany(() => LegacyRating, rating => rating.session)
    legacyRatings!: LegacyRating[];
}

/*
Flows:
- Guest:
   - First time: Create guest cookie and DB entry
    - Subsequent: Check cookie and DB entry when api is called

- Guest -> Registered:
    - Create new user
    - Transfer guest data to new user
    - Delete guest cookie and DB entry
    - Create new session cookie and DB entry

 */