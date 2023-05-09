import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Professor} from "./Professor";
import {ReviewFlag} from "./ReviewFlag";
import Client from "../Client";
import {ReviewRating} from "../Rating";

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Client, (client: Client) => client.reviews)
    client!: Client;

    @ManyToOne(() => Professor, (professor: Professor) => professor.reviews)
    professor!: Professor;

    @Column()
    author!: string;

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
