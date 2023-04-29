import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Client from "./Client";
import {LogAction} from "../../../utils";


@Entity()
class ClientLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Client, (client: Client) => client.logs)
    client!: Client;

    @Column({ type: "enum", enum: LogAction })
    action!: LogAction;

    @Column()
    action_description?: string;

    @CreateDateColumn()
    created_at!: Date;
}

export default ClientLog;