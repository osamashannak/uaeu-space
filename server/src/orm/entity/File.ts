import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm"
import {Course} from "./Course";
import {FileRating} from "./FileRating";

@Entity()
export class File {

    @PrimaryColumn()
    blob_name!: string;

    @ManyToOne(() => Course, course => course.files)
    course!: Course;

    @Column()
    name!: string;

    @Column()
    type!: FileType;

    // TODO change the size to kb
    @Column()
    size!: number;

    @OneToMany(() => FileRating, ratings => ratings.file)
    ratings!: FileRating[]

    @CreateDateColumn()
    created_at!: Date;

}

export enum FileType {
    PDF,
    URL,
    DOC,
    PPT
}
