import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Professor} from "./Professor";
import {ReviewRating} from "./ReviewRating";
import {ReviewFlag} from "./ReviewFlag";

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Professor, (professor: Professor) => professor.reviews)
    professor!: Professor;

    @Column()
    author!: string;

    @Column({default: null})
    client_details!: string;

    @Column()
    score!: number;

    @Column()
    positive!: boolean;

    @Column()
    comment!: string;

    @OneToMany(() => ReviewRating, (rating: ReviewRating) => rating.review)
    ratings!: ReviewRating[];

    @Column({default: false})
    hidden!: boolean;

    @OneToMany(() => ReviewFlag, (flag: ReviewFlag) => flag.review)
    flags!: ReviewFlag[];

    @CreateDateColumn()
    created_at!: Date;
}
