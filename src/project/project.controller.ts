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
import {deleteProjectRequestDto} from "../dto/requests/deleteProjectRequest.dto";
import {deleteProjectResponseDto} from "../dto/response/deleteProjectResponse.dto";
import {GetPinnedProjectsDto} from "../dto/requests/getPinnedProjects.dto";

export const createProject = async (
    req: Request<{}, {}, CreateProjectRequestDto>,
    res: Response<CreateProjectResponseDto | ErrorResponseDto>
) => {
    const { title, content, userId } = req.body;

    try {
        const project = new Project();
        project.title = title;
        project.content = content;
        project.isPinned = false;

        // TypeORM сам установит createdAt и updatedAt благодаря декораторам

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
export const deleteProject = async (
    req: Request<{}, {}, {}, deleteProjectRequestDto>,
    res: Response<deleteProjectResponseDto | ErrorResponseDto>
) => {
    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
    }

    try {
        const project = await Project.findOne({ where: { id: projectId } });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await Project.delete({ id: projectId });

        return res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({
            message: 'Internal server error while deleting project'
        });
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

export const pinProject = async (
    req: Request<{}, {}, { projectId: string }>,
    res: Response<ErrorResponseDto>
) => {
    const { projectId } = req.body;

    if (!projectId) {
        return res.status(400).json({ message: 'projectId is required' });
    }

    try {
        const project = await Project.findOne({ where: { id: projectId } });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.isPinned = true;

        await project.save();

        res.status(201).json({message: 'success'});

    } catch (error) {
        return res.status(500).json({ message: 'Error creating project' });
    }
};

export const getPinnedProjects = async (
    req: Request<{}, {}, {}, { userId: string }>, // Тип для query-параметров
    res: Response<GetPinnedProjectsDto | ErrorResponseDto>
) => {

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const projects = await Project.find({
            where: {
                user: { id: userId },
                isPinned: true
            }
        });
        return res.json({ projects: projects });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error fetching projects' });
    }
};