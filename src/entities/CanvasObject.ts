// src/entities/CanvasObject.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class CanvasObject {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    type: string; // 'square', 'text', etc.

    @Column("jsonb")
    position: { x: number; y: number };

    @Column()
    color: string;

    @ManyToOne(() => User, (user) => user.objects)
    user: User;
}