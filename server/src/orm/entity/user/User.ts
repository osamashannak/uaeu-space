import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Session} from "./Session";
import {Review} from "../professor/Review";
import {CourseFile} from "../CourseFile";
import {ReviewRating} from "../professor/ReviewRating";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    username!: string;

    @OneToMany(() => Review, review => review.user)
    reviews!: Review[];

    @OneToMany(() => CourseFile, courseFile => courseFile.user)
    courseFiles!: CourseFile[];

    @OneToMany(() => ReviewRating, rating => rating.user)
    reviewRatings!: ReviewRating[];

    @OneToMany(() => Session, userSession => userSession.user)
    sessions!: Session[];

    @Column({default: null, nullable: true, unique: true})
    googleId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @CreateDateColumn()
    updatedAt!: Date;

}