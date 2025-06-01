import {Request, Response} from "express";
import {ErrorResponseDto} from "../dto/response/errorResponse.dto";
import {User} from "../entities/User";

export const getUserById = async (
    req: Request<{}, {}, {}, {
        userId: string
    } >,
    res: Response<{
        result: "success" | "failure";
        data: {
            user: User
        }
    } | ErrorResponseDto>
) => {

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            result: "failure",
            message: 'User id is required'
        });
    }

    try {

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                result: "failure",
                message: 'User not found'
            });
        }

        res.status(200).json({
            result: "success",
            data: {
                user: user
            }
        });

    } catch (error) {
        res.status(500).json({
            result: "failure",
            message: 'Error getting user'
        });
    }
};

export const changeUserPassword = async (
    req: Request<{}, {}, {
        userId: string,
        new_password: string,
        old_password: string
    }>,
    res: Response<{
        result: "success" | "failure",
        data: {
            message: string
        }
    } | ErrorResponseDto>
) => {

    const { userId, new_password, old_password } = req.body;

    if (!userId || !new_password || !old_password) {
        return res.status(400).json({
            result: "failure",
            message: 'User id, new password and old_password are required'
        });
    }

    try {

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                result: "failure",
                message: 'User not found'
            });
        }

        const isPasswordValid = await user.comparePassword(old_password);

        if (!isPasswordValid) {
            return res.status(401).json({
                result: "failure",
                message: 'Invalid old password'
            });
        }

        user.password = new_password;

        await user.save();

        return res.status(200).json({
            result: "success",
            data: {
                message: 'Password successfully changed'
            }
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Error changing password'
        });
    }
}