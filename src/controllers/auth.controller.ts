import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import {User} from "../entities/User";
import {LoginResponseDto} from "../dto/response/loginResponse.dto";
import {LoginRequestDto} from "../dto/requests/loginRequest.dto";
import {ErrorResponseDto} from "../dto/response/errorResponse.dto";
import {RegisterRequestDto} from "../dto/requests/registerRequest.dto";
import {token} from "morgan";
import {RegisterResponseDto} from "../dto/response/registerResponse.dto";

const authService = new AuthService();

export const login = async (
    req: Request<{}, {}, LoginRequestDto>,
    res: Response<LoginResponseDto | ErrorResponseDto>
) => {

    const { email, password } = req.body; // Автоматическая типизация из Request

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

        res.json(
            {id: user.id, message: "", access_token: token}
        ); //  ответ если все четко

    } catch (error) { // если в процессе случился анлак
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (
    req: Request<{}, {}, RegisterRequestDto>,
    res: Response<RegisterResponseDto | ErrorResponseDto>
) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = new User(); // создаю пустого юзера

        // заполняю тем, что получил с клиента

        user.email = email;
        user.password = password; // Автоматически хешируется благодаря @BeforeInsert()

        await user.save(); // сохраняю в бд

        const token = authService.generateToken(user); // создаю токен

        res.status(201).json({id: user.id, message: "", access_token: token }); // отдаю токен, если все четко

    } catch (error) { // если анлак
        res.status(400).json({ message: 'Registration failed' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    res.json(req.user); // Пользователь из JWT (добавлен в middleware)
};