import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Course} from "./Course";
import {User} from "./user/User";
import {FileRating} from "./legacy/Rating";
import {Guest} from "./user/Guest";

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

    @ManyToOne(()=> User, user => user.courseFiles, {nullable: true})
    user!: User;

    @ManyToOne(()=> Guest, user => user.courseFiles, {nullable: true})
    guest!: Guest;

    @Column({default: false})
    reviewed!: boolean;

    @Column({nullable: true})
    vt_report!: string;

    @Column({default: false})
    visible!: boolean;

    @Column({default: 0})
    downloads!: number;

    @OneToMany(() => FileRating, ratings => ratings.file)
    ratings!: FileRating[];

    @CreateDateColumn()
    created_at!: Date;

}