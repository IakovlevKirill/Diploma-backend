import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity} from "typeorm";
import { User } from "./User";

@Entity()
export class Project extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' }) // Для хранения JSON
    content: string;

    @ManyToOne(() => User, (user) => user.projects) // Убедитесь, что в User есть поле projects
    user: User;
}