import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany
} from "typeorm";
import { User } from "./User";
import {CanvasNode} from "./CanvasNode";

@Entity()
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({default: 'Untitled'})
    title: string;

    @Column({default: false})
    isPinned: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @Column({ type: 'text', default: ''})
    content: string; // json

    @OneToMany(() => CanvasNode, (node) => node.project, { cascade: true })
    nodes: CanvasNode[];

    @ManyToOne(() => User, (user) => user.projects)
    user: User;
}