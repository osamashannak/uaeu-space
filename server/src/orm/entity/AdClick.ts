import {Column, CreateDateColumn, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class AdClick {

    @PrimaryColumn("inet")
    ipAddress!: string;

    @Column({default: 1})
    visits!: number;

    @Column({default: () => "now()"})
    lastVisit!: Date;

    @CreateDateColumn()
    created_at!: Date;

}
