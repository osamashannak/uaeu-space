import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Course} from "./Course";
import {FileRating} from "./FileRating";

@Entity()
export class CourseFile {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    blob_name!: string;

    @ManyToOne(() => Course, course => course.files)
    course!: Course;

    @Column()
    name!: string;

    @Column()
    type!: string;

    @Column()
    size!: number;

    @Column({default: null})
    client_details!: string;

    @Column({default: false})
    visible!: boolean;

    @Column({default: 0})
    downloads!: number;

    @OneToMany(() => FileRating, ratings => ratings.file)
    ratings!: FileRating[];

    @CreateDateColumn()
    created_at!: Date;

}