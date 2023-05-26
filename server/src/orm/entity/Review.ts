import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Professor} from "./Professor";
<<<<<<< HEAD
import {ReviewRatings} from "./ReviewRatings";
=======
import {ReviewRating} from "./Rating";
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("inet", {nullable: true, default: null})
    author_ip!: string;

    @ManyToOne(() => Professor, professor => professor.reviews)
    professor!: Professor;

    @Column()
    author!: string;

    @Column()
    score!: number;

    @Column()
    positive!: boolean;

    @Column()
    comment!: string;

<<<<<<< HEAD
    @OneToMany(() => ReviewRatings, ratings => ratings.review)
    ratings!: ReviewRatings[]
=======
    @OneToMany(() => ReviewRating, ratings => ratings.review)
    ratings!: ReviewRating[]
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

    @Column({default: false})
    reviewed!: boolean;

    @Column({default: true})
    visible!: boolean;

    @CreateDateColumn()
    created_at!: Date;
}
