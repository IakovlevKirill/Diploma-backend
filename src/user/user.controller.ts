import {Request, Response} from "express";
import {ErrorResponseDto} from "../dto/response/errorResponse.dto";
import {getUserByIdRequestDto} from "../dto/requests/getUserByIdRequest.dto";
import {getUserByIdResponseDto} from "../dto/response/getUserByIdResponse.dto";
import {User} from "../entities/User";

export const getUserById = async (
    req: Request<{}, {},getUserByIdRequestDto >,
    res: Response<getUserByIdResponseDto | ErrorResponseDto>
) => {

    const { id } = req.body;

    try {
        const user = new User()

        res.status(201).json({user});

    } catch (error) {
        res.status(500).json({ message: 'Error getting user' });
    }
};