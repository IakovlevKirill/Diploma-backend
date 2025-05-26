import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne
} from "typeorm";
import {Project} from "./Project";

@Entity()
export class CanvasNode {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("jsonb")
    position: { x: number; y: number };

    @Column()
    parent: string; // id родителя

    @Column("text", { array: true })
    children: string[]; // id детей

    @Column({default: 'node'})
    type: string;

    @Column({default: 'D9D9D9'})
    color: string;

    @ManyToOne(() => Project, (project) => project.nodes)
    project: Project;
}