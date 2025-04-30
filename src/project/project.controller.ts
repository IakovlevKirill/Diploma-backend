import { Request, Response } from 'express';
import {ErrorResponseDto} from "../dto/response/errorResponse.dto";
import {CreateProjectRequestDto} from "../dto/requests/createProjectRequest.dto";
import {Project} from "../entities/Project";
import {CreateProjectResponseDto} from "../dto/response/createProjectResponse.dto";
import {getProjectByIdRequestDto} from "../dto/requests/getProjectByIdRequest.dto";
import {getProjectByIdResponseDto} from "../dto/response/getProjectByIdResponse.dto";

export const createProject = async (
    req: Request<{}, {}, CreateProjectRequestDto>,
    res: Response<CreateProjectResponseDto | ErrorResponseDto>
) => {

    const { title, content } = req.body;

    try {
        console.log(req);
        res.status(201).json({ message: '123123' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting project' });
    }

};

export const getProjectById = async (
    req: Request<{}, {},getProjectByIdRequestDto >,
    res: Response<getProjectByIdResponseDto | ErrorResponseDto>
)=> {

    const { id } = req.body;

    try {
        const project = new Project()


        res.status(201).json('тут верну проект');
    } catch (error) {
        res.status(500).json({ message: 'Error getting project' });
    }

}
