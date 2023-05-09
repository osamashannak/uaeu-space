import {
    ChildEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    TableInheritance
} from "typeorm"
import Client from "./Client";
import {CourseFile} from "./course/CourseFile";
import {Review} from "./professor/Review";

@Entity()
@TableInheritance({column: {type: "varchar", name: "type"}})
export abstract class Rating {

    @PrimaryGeneratedColumn()
    id!: string;

    @ManyToOne(() => Client, client => client.ratings)
    client!: Client;

    @Column()
    is_positive!: boolean;

    @CreateDateColumn()
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
