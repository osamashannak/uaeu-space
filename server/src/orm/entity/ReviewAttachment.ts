import {Column, CreateDateColumn, Entity, PrimaryColumn} from "typeorm";


@Entity()
export class ReviewAttachment {

    @PrimaryColumn()
    id!: string;

    @Column()
    mime_type!: string;

    @Column()
    size!: number;

    @Column()
    width!: number;

    @Column()
    height!: number;

    @Column({default: null, nullable: true})
    visible!: boolean;

    @Column("inet")
    ip_address!: string;

    @CreateDateColumn({nullable: true})
    created_at!: Date;

}