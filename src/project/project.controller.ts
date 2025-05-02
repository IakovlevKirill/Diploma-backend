import { Request, Response } from 'express';
import {ErrorResponseDto} from "../dto/response/errorResponse.dto";
import {CreateProjectRequestDto} from "../dto/requests/createProjectRequest.dto";
import {Project} from "../entities/Project";
import {CreateProjectResponseDto} from "../dto/response/createProjectResponse.dto";
import {getProjectByIdRequestDto} from "../dto/requests/getProjectByIdRequest.dto";
import {getProjectByIdResponseDto} from "../dto/response/getProjectByIdResponse.dto";
import {User} from "../entities/User";
import {GetAllProjectsRequestDto} from "../dto/requests/getAllProjectsRequest.dto";
import {GetAllProjectsResponseDto} from "../dto/response/getAllProjectsResponse.dto";

export const createProject = async (
    req: Request<{}, {}, CreateProjectRequestDto>,
    res: Response<CreateProjectResponseDto | ErrorResponseDto>
) => {
    const { title, content, userId } = req.body;

    try {
        const project = new Project();

        project.title = title;
        project.content = content;
        // @ts-ignore
        project.user = await User.findOne({ where: { id: userId } });


        await project.save();

        // После сохранения project уже имеет ID
        return res.json({ id: project.id });

    } catch (error) {
        return res.status(500).json({ message: 'Error creating project' });
    }
};

export const getProjectById = async (
    req: Request<{}, {},getProjectByIdRequestDto >,
    res: Response<getProjectByIdResponseDto | ErrorResponseDto>
)=> {

    const { projectId } = req.query;

    try {
        // @ts-ignore
        const project = await Project.findOne({ where: { id : projectId } });
        if (project) {
            // @ts-ignore
            res.status(201).json({project: project});
        }
    } catch (error) {
        res.status(500).json({ message: 'Error getting project' });
    }
}

export const getAllProjects = async (
    req: Request<{}, {}, {}, { userId: string }>, // Тип для query-параметров
    res: Response<GetAllProjectsResponseDto | ErrorResponseDto>
) => {

    const { userId } = req.query;
    console.log(userId);

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const projects = await Project.find({
            where: {
                user: { id: userId }  // Ищем по ID связанного пользователя
            },
            relations: ['user']     // При необходимости подгружаем связанные данные
        });
        return res.json({ projects });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error fetching projects' });
    }
};