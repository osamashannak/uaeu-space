import {
    ChildEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, PrimaryColumn,
    TableInheritance
} from "typeorm"
import {CourseFile} from "./CourseFile";
import {Review} from "./Review";
import {User} from "./user/User";

@Entity()
@TableInheritance({column: {type: "varchar", name: "type"}})
export abstract class Rating {

    @PrimaryColumn("uuid")
    request_key!: string;

    @Column()
    is_positive!: boolean;

    @Column("inet", {nullable: true, default: null})
    ip_address!: string;

    @ManyToOne(() => User, user => user.ratings)
    user!: User;

    @CreateDateColumn({nullable: true, default: null})
    created_at!: Date;

}

@ChildEntity()
export class FileRating extends Rating {

    @ManyToOne(() => CourseFile, file => file.ratings)
    file!: CourseFile;

}

@ChildEntity()
export class ReviewRating extends Rating {

    @ManyToOne(() => Review, review => review.ratings)
    review!: Review;

}