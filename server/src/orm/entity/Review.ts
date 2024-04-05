import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Professor} from "./Professor";
import {ReviewRating} from "./Rating";
import {ReviewAttachment} from "./ReviewAttachment";

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

    @Column({type: "simple-array", default: null, nullable: true})
    attachments!: string[];

    @OneToMany(() => ReviewRating, ratings => ratings.review)
    ratings!: ReviewRating[];

    @Column({default: false})
    reviewed!: boolean;

    @Column({default: true})
    visible!: boolean;

    @CreateDateColumn()
    created_at!: Date;
}
