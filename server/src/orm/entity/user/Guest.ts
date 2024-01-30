import {Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {Review} from "../professor/Review";
import {CourseFile} from "../CourseFile";

@Entity()
export class Guest {

    @PrimaryColumn({unique: true})
    token!: string;

    @Column()
    ipAddress!: string;

    @Column()
    userAgent!: string;

    @OneToMany(() => Review, review => review.user)
    reviews!: Review[];

    @OneToMany(() => CourseFile, courseFile => courseFile.user)
    courseFiles!: CourseFile[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}