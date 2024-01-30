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
import {Review} from "../professor/Review";
import {CourseFile} from "../CourseFile";
import {ReviewRating} from "../professor/ReviewRating";


@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Review, review => review.user)
    reviews!: Review[];

    @OneToMany(() => CourseFile, courseFile => courseFile.user)
    courseFiles!: CourseFile[];

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

    @OneToMany(() => ReviewRating, rating => rating.user)
    reviewRatings!: ReviewRating[];

}

@ChildEntity("guest")
export class Guest extends User {

}