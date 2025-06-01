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
    req: Request<{}, {}, {
        email: string;
        password: string;
    }>,
    res: Response<{
        result: "success" | "failure";
        data: {
            access_token: string;
            id: string;
        },
    } | ErrorResponseDto>
) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            result: "failure",
            message: 'Email and password are required'
        });
    }

    try {
        const user = await authService.validateUser(email, password);

        if (!user) {
            return res.status(401).json({
                result: "failure",
                message: 'Invalid credentials'
            });
        }

        const token = authService.generateToken(user);

        res.status(200).json({
            result: "success",
            data: {access_token: token, id: user.id}
        });

    } catch (error) {
        res.status(500).json({
            result: "failure",
            message: 'Server error'
        });
    }
};

export const register = async (
    req: Request<{}, {}, {
        email: string;
        password: string;
    }>,
    res: Response<{
        result: "success" | "failure",
        data: {
            access_token: string;
            id: string;
        }
    } | ErrorResponseDto>
) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            result: "failure",
            message: "Email and password are required"
        });
    }

    try {
        const user = new User();

        user.email = email;
        user.password = password;

        await user.save();

        const token = authService.generateToken(user);

        res.status(201).json({
            result: "success",
            data: {
                access_token: token,
                id: user.id,
            }
        });

    } catch (error) {
        res.status(500).json({
            result: "failure",
            message: 'Registration failed'
        });
    }
};