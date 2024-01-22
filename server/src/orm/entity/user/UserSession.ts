import {Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {Guest} from "./Guest";


@Entity()
export class UserSession {

    @PrimaryColumn()
    token!: string;

    @ManyToOne(() => Guest, guest => guest.sessions)
    user!: Guest;

}