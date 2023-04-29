import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Professor} from "./Professor";
import {ReviewRating} from "./ReviewRating";
import {Review} from "./Review";

@Entity()
export class ReviewFlag {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Review, (review: Review) => review.flags)
    review!: Review;

    @CreateDateColumn()
    created_at!: Date;
}
