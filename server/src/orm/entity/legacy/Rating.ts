import {
    ChildEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, PrimaryColumn,
    TableInheritance
} from "typeorm"
import {CourseFile} from "../CourseFile";
import {Review} from "../professor/Review";
import {GuestSession} from "../user/Session";

@Entity()
@TableInheritance({column: {type: "varchar", name: "type"}})
export abstract class LegacyRating {

    @PrimaryColumn("uuid")
    request_key!: string;

    @Column()
    is_positive!: boolean;

    @Column("inet", {nullable: true, default: null})
    ip_address!: string;

    @ManyToOne(() => GuestSession, session => session.legacyRatings)
    session!: GuestSession;

    @CreateDateColumn({nullable: true, default: null})
    created_at!: Date;

}

@ChildEntity()
export class FileRating extends LegacyRating {

    @ManyToOne(() => CourseFile, file => file.ratings)
    file!: CourseFile;

}

@ChildEntity()
export class ReviewRating extends LegacyRating {

    @ManyToOne(() => Review, review => review.ratings)
    review!: Review;

}