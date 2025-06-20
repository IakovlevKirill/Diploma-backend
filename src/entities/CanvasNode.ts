import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    PrimaryColumn
} from "typeorm";
import {Project} from "./Project";

@Entity()
export class CanvasNode extends BaseEntity {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column("jsonb")
    position: { x: number; y: number };

    @Column("jsonb")
    size: { width: number; height: number ; };

    @Column()
    parentId: string; // id родителя

    @Column("text", { array: true })
    children: string[]; // id детей

    @Column()
    color: string;

    @ManyToOne(() => Project, (project) => project.nodes, { onDelete: 'CASCADE' })
    project: Project;

}