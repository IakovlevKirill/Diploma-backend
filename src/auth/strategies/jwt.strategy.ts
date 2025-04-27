import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../entities/User';
import passport from 'passport';

// Настройки для JWT-стратегии
const jwtOptions = {
    // Откуда брать токен (из заголовка `Authorization: Bearer <token>`)
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Секретный ключ для проверки подписи токена (должен совпадать с тем, которым токен подписывался)
    secretOrKey: 'your-secret-key', // Лучше хранить в process.env.JWT_SECRET
};

// Функция для настройки стратегии
export const configurePassport = () => {
    // Регистрируем стратегию в Passport
    passport.use(
        new JwtStrategy(jwtOptions, async (payload, done) => {
            try {
                // Ищем пользователя в БД по ID из токена (payload.sub)
                const user = await User.findOne({ where: { id: payload.sub } });

                if (user) {
                    // Если пользователь найден — передаём его в req.user
                    return done(null, user);
                }
                // Если не найден — возвращаем false (аутентификация провалена)
                return done(null, false);
            } catch (error) {
                // Если ошибка — передаём её
                return done(error, false);
            }
        }),
    );
};