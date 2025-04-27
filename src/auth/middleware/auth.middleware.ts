import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticateJwt = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    passport.authenticate('jwt', { session: false }, (err : any, user : any) => {

        if (err || !user) { // если какая-то ошибка
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user; // Добавляем пользователя в запрос

        next();
    })(req, res, next);
};