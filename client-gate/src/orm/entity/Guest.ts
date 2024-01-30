import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Guest {

    @PrimaryColumn({unique: true})
    token!: string;

    @Column()
    ipAddress!: string;

    @Column()
    userAgent!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}