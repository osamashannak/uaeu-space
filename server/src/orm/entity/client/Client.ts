import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import ClientLog from "./ClientLog";

@Entity()
class Client {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    session_key!: string;

    @Column({ nullable: true })
    ip_address!: string;

    @Column({ nullable: true })
    user_agent!: string;

    @Column({ nullable: true })
    country!: string;

    @OneToMany(() => Client, (clientLog: ClientLog) => clientLog.client)
    logs!: ClientLog;

    @Column()
    last_active!: Date;
}

export default Client;