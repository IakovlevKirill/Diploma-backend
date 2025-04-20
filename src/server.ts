import app from './app';
import { AppDataSource } from './config/data-source';

const PORT = 5000;

AppDataSource.initialize() // Сначала БД
    .then(() => {
        app.listen(PORT, () => { // Затем сервер
            console.log(`Server started on port ${PORT}`);
        });
    })
    .then(() => console.log("DB connected"))
    .catch(err => {
        console.error("Raw error:", err); // Выведет оригинальный объект ошибки
        console.error("Message:", err.message); // Чистый текст ошибки
    });