import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {User} from "../user/User";
import {Review} from "./Review";


@Entity()
export abstract class ReviewRating {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type!: RatingType;

    @ManyToOne(() => User, user => user.reviewRatings)
    user!: User;

    @ManyToOne(() => Review, review => review.ratings)
    review!: Review;

    @CreateDateColumn()
    created_at!: Date;
}


export enum RatingType {
    LIKE = "LIKE",
    DISLIKE = "DISLIKE",
}