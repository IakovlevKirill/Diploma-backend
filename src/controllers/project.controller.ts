import { Request, Response } from 'express';

import {Project} from "../entities/Project";
import {User} from "../entities/User";

import {ErrorResponseDto} from "../dto/response/errorResponse.dto";
import {getProjectByIdRequestDto} from "../dto/requests/getProjectByIdRequest.dto";
import {getProjectByIdResponseDto} from "../dto/response/getProjectByIdResponse.dto";
import {GetAllProjectsResponseDto} from "../dto/response/getAllProjectsResponse.dto";
import {deleteProjectRequestDto} from "../dto/requests/deleteProjectRequest.dto";
import {deleteProjectResponseDto} from "../dto/response/deleteProjectResponse.dto";
import {GetPinnedProjectsDto} from "../dto/requests/getPinnedProjects.dto";

export const createProject = async (
    req: Request<{}, {}, {
        userId: string;
    }>,
    res: Response<{
        result: "success" | "failure";
        data: {
            project: Project;
        }
    } | ErrorResponseDto>
) => {

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            result: "failure",
            message: 'userId is required'
        });
    }

    try {

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                result: "failure",
                message: "User not found",
            });
        }

        const project = new Project();

        project.user = user

        await project.save();

        return res.status(201).json({
            result: "success",
            data: {
                project: project,
            },
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: "Error creating project",
        });
    }
};

export const duplicateProject = async (
    req: Request<{}, {}, {
        userId: string,
        newTitle: string
    }>,
    res: Response<{
        result: "success" | "failure",
        data: {
            project: Project
        }
    } | ErrorResponseDto>
) => {

    const { userId, newTitle } = req.body;

    if (!userId || !newTitle) {
        return res.status(400).json({
            result: "failure",
            message: 'userId and newTitle are required'
        });
    }

    try {

        const user = await User.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({
                result: "failure",
                message: "User not found"
            });
        }

        // TODO исправить эндпоинт(контент не копируется)

        const project = new Project();

        project.title = newTitle;
        project.user = user;

        await project.save();

        return res.status(201).json({
            result: "success",
            data: {
                project: project,
            },
        });


    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Error duplicating project'
        });
    }
};

export const getProjectById = async (
    req: Request<{}, {}, {}, {
        projectId: string;
    }>,
    res: Response<{
        result: "success" | "failure",
        data: {
            project: Project;
        }
    } | ErrorResponseDto>
)=> {

    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({
            result: "failure",
            message: 'Id is required'
        });
    }

    try {

        const project = await Project.findOne({ where: { id: projectId } });

        if (!project) {
            return res.status(404).json({
                result: "failure",
                message: "Project not found",
            });
        }

        res.status(200).json({
            result: "success",
            data: {
                project: project
            }
        });

    } catch (error) {
        res.status(500).json({
            result: "failure",
            message: 'Error getting project'
        });
    }
}

export const deleteProject = async (
    req: Request<{}, {}, {}, {
        projectId: string;
    }>,
    res: Response<{
        result: "success" | "failure",
        message: string
    } | ErrorResponseDto>
) => {

    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({
            result: "failure",
            message: 'Project ID is required'
        });
    }

    try {

        const project = await Project.findOne({ where: { id: projectId } });

        if (!project) {
            return res.status(404).json({
                result: "failure",
                message: 'Project not found'
            });
        }

        await Project.delete({ id: projectId });

        return res.status(200).json({
            result: "success",
            message: 'Project deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Internal server error while deleting project'
        });
    }
}

export const getAllProjects = async (
    req: Request<{}, {}, {}, {
        userId: string
    }>,
    res: Response<{
        result: "success" | "failure",
        data: {
            projects: Project[];
        }
    } | ErrorResponseDto>
) => {

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            result: "failure",
            message: 'User ID is required'
        });
    }

    try {
        const projects = await Project.find({
            where: {
                user: { id: userId }
            },
            relations: ['user']
        });

        return res.status(200).json({
            result: "success",
            data: {
                projects: projects
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            result: "failure",
            message: 'Error fetching projects'
        });
    }
};

export const pinProject = async (
    req: Request<{}, {}, {
        projectId: string
    }>,
    res: Response<{
        result: "success" | "failure",
        message: string,
    } | ErrorResponseDto>
) => {

    const { projectId } = req.body;

    if (!projectId) {
        return res.status(400).json({
            result: "failure",
            message: 'projectId is required'
        });
    }

    try {

        const project = await Project.findOne({
            where: {
                id: projectId
            }
        });

        if (!project) {
            return res.status(404).json({
                result: "failure",
                message: 'Project not found'
            });
        }

        project.isPinned = true;

        await project.save();

        res.status(200).json({
            result: 'success',
            message: 'Project pinned'
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Error pinning project'
        });
    }
};

export const unpinProject = async (
    req: Request<{}, {}, {
        projectId: string
    }>,
    res: Response<{
        result: "success" | "failure",
        message: string,
    } | ErrorResponseDto>
) => {

    const { projectId } = req.body;

    if (!projectId) {
        return res.status(400).json({
            result: "failure",
            message: 'projectId is required'
        });
    }

    try {

        const project = await Project.findOne({
            where: {
                    id: projectId
            }
        });

        if (!project) {
            return res.status(404).json({
                result: "failure",
                message: 'Project not found'
            });
        }

        project.isPinned = false;

        await project.save();

        res.status(200).json({
            result: 'success',
            message: 'Project unpinned'
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Error unpinning project'
        });
    }
};

export const getPinnedProjects = async (
    req: Request<{}, {}, {}, {
        userId: string
    }>,
    res: Response<{
        result: "success" | "failure",
        data: {
            projects: Project[]
        }
    } | ErrorResponseDto>
) => {

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            result: "failure",
            message: 'User ID is required'
        });
    }

    try {

        const projects = await Project.find({
            where: {
                user: { id: userId },
                isPinned: true
            }
        });

        return res.status(200).json({
            result: "success",
            data: {
                projects: projects
            }
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Error fetching projects'
        });
    }
};

export const changeProjectTitle = async (
    req: Request<{}, {}, {
        projectId: string,
        projectTitle: string
    }>,
    res: Response<{
        result: "success" | "failure",
        message: string,
    } | ErrorResponseDto>
) => {
    const { projectId, projectTitle } = req.body;

    if (!projectId || !projectTitle?.trim()) {
        return res.status(400).json({
            result: "failure",
            message: 'projectId and title are required'
        });
    }

    if (projectTitle.length > 30) {
        return res.status(400).json({
            result: "failure",
            message: 'Title must be less than 30 characters'
        });
    }

    try {

        const project = await Project.findOne({ where: { id: projectId } });

        if (!project) {
            return res.status(404).json({
                result: "failure",
                message: 'Project not found'
            });
        }

        project.title = projectTitle;

        await project.save();

        res.status(200).json({
            result: "success",
            message: 'Project title changed'
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Error changing project title'
        });
    }
};
