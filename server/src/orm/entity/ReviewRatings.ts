import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm"
import {Review} from "./Review";

@Entity()
export class ReviewRatings {

    @PrimaryColumn()
    request_key!: string;

    @Column()
    is_positive!: boolean;

    @ManyToOne(() => Review, review => review.ratings)
    review!: Review

}
