import {Column, DataSource, Entity, OneToMany, PrimaryColumn} from "typeorm"
import {File} from "./File";

@Entity()
export class Course {

    @PrimaryColumn()
    tag!: string;

    @Column()
    name!: string;

    @OneToMany(() => File, file => file.course)
    files!: File[];

    @Column({default: 0})
    views!: number;

    addView(conn: DataSource) {
        const userRepo = conn.getRepository(Course);
        this.views += 1;
        return userRepo.save(this);
    }

}
