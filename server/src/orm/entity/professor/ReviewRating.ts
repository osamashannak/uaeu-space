import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm"
import {Review} from "./Review";

@Entity()
export class ReviewRating {

    @PrimaryColumn()
    request_key!: string;

    @Column({default: null})
    client_details!: string;

    @Column()
    is_positive!: boolean;

    @ManyToOne(() => Review, review => review.ratings)
    review!: Review

    @CreateDateColumn()
    created_at!: Date;
}
