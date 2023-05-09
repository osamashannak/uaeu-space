import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Review} from "./Review";

@Entity()
export class ReviewFlag {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Review, (review: Review) => review.flags)
    review!: Review;

}
