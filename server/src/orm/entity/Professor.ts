import {Column, DataSource, Entity, OneToMany, PrimaryColumn} from "typeorm"
import {Review} from "./Review";

@Entity()
export class Professor {

    @PrimaryColumn()
    email!: string

    @Column()
    name!: string

    @Column()
    college!: string

    @OneToMany(() => Review, review => review.professor)
    reviews!: Review[];

    @Column({default: 0})
    views!: number

    addView(conn: DataSource) {
        const userRepo = conn.getRepository(Professor);
        this.views += 1;
        return userRepo.save(this);
    }

}
