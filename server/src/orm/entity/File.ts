import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm"
import {Course} from "./Course";

@Entity()
export class File {

    @PrimaryColumn()
    reference!: number;

    @ManyToOne(() => Course, course => course.files)
    course!: Course;

    @Column()
    name!: string;

    @Column()
    type!: string;

    @Column()
    size!: number;

    @CreateDateColumn()
    created_at!: Date;

}
