import {Column, CreateDateColumn, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class FileAccessToken {

    @PrimaryColumn("inet")
    client_address!: string;

    @Column()
    url!: string;

    @Column()
    uses!: number;

    @Column()
    expires_on!: Date;

    @CreateDateColumn()
    created_at!: Date;

}