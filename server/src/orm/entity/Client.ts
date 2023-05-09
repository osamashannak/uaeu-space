import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {CourseFile} from "./course/CourseFile";
import {Review} from "./professor/Review";
import {Rating} from "./Rating";

@Entity()
export default class Client {

    @PrimaryColumn()
    client_key!: string;

    @Column()
    ip_address!: string;

    @Column()
    user_agent!: string;

    @OneToMany(() => CourseFile, file => file.client)
    uploads!: CourseFile[];

    @OneToMany(() => Review, review => review.client)
    reviews!: Review[];

    @OneToMany(() => Rating, rating => rating.client)
    ratings!: Rating[];

    @Column("simple-array")
    visits!: string[];

    @Column()
    last_active!: Date;
}