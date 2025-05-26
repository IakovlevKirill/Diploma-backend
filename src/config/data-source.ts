import 'dotenv/config'; // Добавьте эту строку в самом начале файла
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { CanvasNode } from "../entities/CanvasNode";
import {Project} from "../entities/Project";

// файл конфигурации подключения к базе данных через TypeORM

export const AppDataSource = new DataSource({
    // Тип БД (PostgreSQL)
    type: "postgres",

    // Данные подключения (берутся из .env)
    host: String(process.env.DB_HOST),         // Адрес сервера БД (обычно localhost)
    port: Number(process.env.DB_PORT),         // Порт (по умолчанию 5432)
    username: String(process.env.DB_USERNAME), // Логин (например, postgres)
    password: String(process.env.DB_PASSWORD), // Пароль
    database: String(process.env.DB_NAME),     // Имя базы (например, rpg_forge)

    // Опасная настройка! Автоматически изменяет схему БД под сущности
    synchronize: true, // Только для разработки!

    // Логирование SQL-запросов в консоль
    logging: true,

    // Регистрация сущностей (таблиц)
    entities: [User, CanvasNode, Project],

    // Миграции (пока не используем)
    migrations: [],

    // Подписчики на события (пока не используем)
    subscribers: [],

    extra: {
        charset: 'utf8mb4', // Для поддержки кириллицы
    }
});