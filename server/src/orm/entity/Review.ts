import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
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
    score!: number

    @Column()
    positive!: boolean;

    @Column()
    comment!: string

    @CreateDateColumn()
    created_at!: Date;

}
