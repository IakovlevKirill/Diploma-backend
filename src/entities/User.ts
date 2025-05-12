import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate, BaseEntity
} from 'typeorm';
import { CanvasObject } from './CanvasObject';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude() // Исключаем пароль из ответов API
    password: string;

    @Column({ nullable: true })
    username: string;

    @Column({ default: 'user' })
    role: string;

    @Column({ nullable: true })
    projects: string;

    @Column({ default: false })
    isVerified: boolean;

    @OneToMany(() => CanvasObject, (object) => object.user)
    objects: CanvasObject[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // ========================
    // Методы для работы с паролем
    // ========================

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return bcrypt.compare(attempt, this.password);
    }

    // ========================
    // Пример метода для API-ответа
    // ========================
    toJSON() {
        const { password, ...rest } = this;
        return rest;
    }
}