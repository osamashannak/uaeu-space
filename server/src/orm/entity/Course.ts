import {Column, DataSource, Entity, OneToMany, PrimaryColumn} from "typeorm"
import {CourseFile} from "./CourseFile";

@Entity()
export class Course {

    @PrimaryColumn()
    tag!: string;

    @Column()
    name!: string;

    @OneToMany(() => CourseFile, file => file.course)
    files!: CourseFile[];

    @Column({default: 0})
    views!: number;

    addView(conn: DataSource) {
        const userRepo = conn.getRepository(Course);
        this.views += 1;
        return userRepo.save(this);
    }

}
