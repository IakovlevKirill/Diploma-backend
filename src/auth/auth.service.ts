import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export class AuthService {

    // методы для обработки запросов


    // валидация
    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await User.findOne({ where: { email } });
        if (user && await user.comparePassword(password)) {
            return user;
        }
        return null;
    }

    // генерация jwt токена
    generateToken(user: User): string {
        return jwt.sign(
            { sub: user.id, email: user.email },
            'your-secret-key', // Должен совпадать с секретом в Passport!
            { expiresIn: '1h' },
        );
    }
}