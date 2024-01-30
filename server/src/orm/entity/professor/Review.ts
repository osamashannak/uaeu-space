import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Professor} from "./Professor";
import {User} from "../user/User";
import {ReviewRating} from "./ReviewRating";
import {Guest} from "../user/Guest";

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

    @Column({default: null, nullable: true})
    attachment!: string;

    @ManyToOne(()=> User, user => user.reviews, {nullable: true})
    user!: User;

    @ManyToOne(()=> Guest, user => user.reviews, {nullable: true})
    guest!: Guest;

    @OneToMany(() => ReviewRating, ratings => ratings.review)
    ratings!: ReviewRating[];

    @Column({default: false})
    reviewed!: boolean;

    @Column({default: true})
    visible!: boolean;

    @CreateDateColumn()
    created_at!: Date;
}
