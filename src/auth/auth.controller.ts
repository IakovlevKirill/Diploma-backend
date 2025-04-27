import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {User} from "../entities/User";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {

    const { // запрашиваю от клиента
        email,
        password
    } = req.body;

    // Проверка наличия email и password
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await authService.validateUser(email, password); // пробую получить пользователя по кредам

        if (!user) { //  если анлак
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = authService.generateToken(user); // делаю токен чтобы его жоостко отправить в ответе

        res.json({ access_token: token }); //  ответ если все четко

    } catch (error) { // если в процессе случился анлак
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (req: Request, res: Response) => {

    const {
        email,
        password,
        username
    } = req.body; // прошу от клиента

    try {
        const user = new User(); // создаю пустого юзера

        // заполняю тем, что получил с клиента

        user.email = email;
        user.password = password; // Автоматически хешируется благодаря @BeforeInsert()
        user.username = username;

        await user.save(); // сохраняю в бд

        const token = authService.generateToken(user); // создаю токен

        res.status(201).json({ access_token: token }); // отдаю токен, если все четко

    } catch (error) { // если анлак
        res.status(400).json({ message: 'Registration failed' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    res.json(req.user); // Пользователь из JWT (добавлен в middleware)
};