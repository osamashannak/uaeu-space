import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm"
import {File} from "./File";

@Entity()
export class Course {

    @PrimaryColumn()
    tag!: string;

    @Column()
    name!: string;

    @OneToMany(() => File, file => file.course)
    files!: File[];

}
