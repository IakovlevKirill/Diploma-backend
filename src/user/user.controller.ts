import {Request, Response} from "express";
import {ErrorResponseDto} from "../dto/response/errorResponse.dto";
import {User} from "../entities/User";

export const getUserById = async (
    req: Request<{}, {}, {}, {userId: string} >,
    res: Response<User | ErrorResponseDto>
) => {

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User id is required' });
    }

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Error getting user' });
    }
};

export const changeUserPassword = async (
    req: Request<{}, {}, {userId: string, new_password: string, old_password: string }>,
    res: Response<ErrorResponseDto | { message: string }>
) => {
    const { userId, new_password, old_password } = req.body;

    if (!userId || !new_password || !old_password) {
        return res.status(400).json({ message: 'User id, new password and old_password are required' });
    }

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Проверяем старый пароль
        const isPasswordValid = await user.comparePassword(old_password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        // Устанавливаем и сохраняем новый пароль (хеширование происходит в модели)
        user.password = new_password;
        await user.save();

        return res.status(200).json({ message: 'Password successfully changed' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error changing password' });
    }
}