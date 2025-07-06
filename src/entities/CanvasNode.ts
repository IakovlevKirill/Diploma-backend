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

    @Column({default: "untyped"})
    type: string;

    @Column({default: "#D9D9D9"})
    pointColor: string;

    @Column("jsonb", {nullable: true})
    position: { x: number; y: number };

    @Column("jsonb", {default: { width: 100, height: 100}})
    size: { width: number; height: number ; };

    @Column()
    parentId: string; // id родителя

    @Column("text", { array: true })
    children: string[]; // id детей

    @Column({nullable: true})
    color: string;

    @ManyToOne(() => Project, (project) => project.nodes, { onDelete: 'CASCADE' })
    project: Project;

}