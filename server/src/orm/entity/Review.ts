import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from "typeorm"
import {Professor} from "./Professor";

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Professor, professor => professor.reviews)
    professor!: Professor

    @Column()
    author!: string

    @Column()
    quality!: number

    @Column()
    difficulty!: number

    @Column()
    comment!: string

    @CreateDateColumn()
    created_at!: Date;

}
