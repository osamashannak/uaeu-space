import {Entity, PrimaryColumn, Column, OneToMany} from "typeorm"
import {Review} from "./Review";

@Entity()
export class Professor {

    @PrimaryColumn()
    email!: string

    @Column()
    name!: string

    @Column()
    department!: string

    @OneToMany(() => Review, review => review.professor)
    reviews!: Review[];

}
