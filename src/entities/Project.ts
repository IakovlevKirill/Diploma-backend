import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    UpdateDateColumn,
    CreateDateColumn
} from "typeorm";
import { User } from "./User";

@Entity()
export class Project extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    isPinned: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @Column({ type: 'text' }) // Для хранения JSON
    content: string;

    @ManyToOne(() => User, (user) => user.projects) // Убедитесь, что в User есть поле projects
    user: User;
}