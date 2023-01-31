import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm"
import {File} from "./File";

@Entity()
export class FileRating {

    @PrimaryColumn()
    request_key!: string;

    @Column()
    is_positive!: boolean;

    @ManyToOne(() => File, file => file.ratings)
    file!: File

}
