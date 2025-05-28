import { Request, Response } from 'express';

import {Project} from "../entities/Project";
import {User} from "../entities/User";

import {ErrorResponseDto} from "../dto/response/errorResponse.dto";
import {CreateProjectRequestDto} from "../dto/requests/createProjectRequest.dto";
import {CreateProjectResponseDto} from "../dto/response/createProjectResponse.dto";
import {getProjectByIdRequestDto} from "../dto/requests/getProjectByIdRequest.dto";
import {getProjectByIdResponseDto} from "../dto/response/getProjectByIdResponse.dto";
import {GetAllProjectsResponseDto} from "../dto/response/getAllProjectsResponse.dto";
import {deleteProjectRequestDto} from "../dto/requests/deleteProjectRequest.dto";
import {deleteProjectResponseDto} from "../dto/response/deleteProjectResponse.dto";
import {GetPinnedProjectsDto} from "../dto/requests/getPinnedProjects.dto";
import {CanvasNode} from "../entities/CanvasNode";

export const createProject = async (
    req: Request<{}, {}, CreateProjectRequestDto>,
    res: Response<CreateProjectResponseDto | ErrorResponseDto>
) => {
    const { userId } = req.body;

    try {
        const project = new Project();
        project.isPinned = false;

        // TypeORM сам установит createdAt и updatedAt благодаря декораторам

        // @ts-ignore
        project.user = await User.findOne({ where: { id: userId } });

        await project.save();

        // После сохранения project уже имеет ID
        return res.json({ project: project });

    } catch (error) {
        return res.status(500).json({ message: 'Error creating project' });
    }
};

export const duplicateProject = async (
    req: Request<{}, {}, { userId: string, newTitle: string }>,
    res: Response<{ project: Project } | ErrorResponseDto>
) => {
    const { userId, newTitle } = req.body;

    try {
        const project = new Project();

        // @ts-ignore
        project.user = await User.findOne({ where: { id: userId } });

        project.title = newTitle;

        await project.save();

        // После сохранения project уже имеет ID
        return res.json({ project: project });

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

export const unpinProject = async (
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

        project.isPinned = false;

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

export const changeProjectTitle = async (
    req: Request<{}, {}, { projectId: string, projectTitle: string }>,
    res: Response<ErrorResponseDto>
) => {
    const { projectId, projectTitle } = req.body;

    if (!projectId || !projectTitle) {
        return res.status(400).json({ message: 'projectId and projectTitle is required' });
    }

    try {
        const project = await Project.findOne({ where: { id: projectId } });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.title = projectTitle;

        await project.save();

        res.status(201).json({message: 'success'});

    } catch (error) {
        return res.status(500).json({ message: 'Error changing project title' });
    }
};

/// NODE CONTROLLER

export const getNodesByProjectId = async (
    req: Request<{ projectId: string }>,
    res: Response<CanvasNode[] | ErrorResponseDto>
) => {

    const { projectId } = req.query;

    try {

        // @ts-ignore
        const nodes = await CanvasNode.find({where: {project: { id: projectId },}});

        res.status(201).json(nodes);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching nodes' });
    }
};

export const createNode = async (
    req: Request<{}, {}, {
        name: string,
        projectId: string,
        position: { x: number; y: number },
        size: { width: number; height: number; },
        parent: string,
        children: string[],
        color: string
    }>,
    res: Response<{
        created_node_id :string
    } | ErrorResponseDto>
) => {
    const { projectId, position, parent, children, name, size, color } = req.body;

    if (!projectId || !position || !parent || !children || !name || !size) {
        return res.status(400).json({ message: 'Match all required fields' });
    }

    try {
        const node = new CanvasNode();

        const project = await Project.findOne({ where: { id: projectId } });

        if (!project) return res.status(404).json({ message: 'Project not found' });

        node.position = position;
        node.children = children;
        node.project = project;
        node.parent = parent;
        node.name = name;
        node.size = size;
        node.color = color;

        await node.save();

        return res.json({ created_node_id : node.id });

    } catch (error) {
        return res.status(500).json({ message: 'Error creating node' });
    }
};

export const deleteNode = async (
    req: Request<{}, {}, {}, { nodeId: string }>,
    res: Response<ErrorResponseDto>
) => {
    const { nodeId } = req.query;

    if (!nodeId) {
        return res.status(400).json({ message: 'nodeId is required' });
    }

    try {
        const node = await CanvasNode.findOne({ where: { id: nodeId } });

        if (!node) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await CanvasNode.delete({ id: nodeId });

        return res.status(200).json({
            message: 'node deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while deleting node'
        });
    }
}

export const updateNode = async (
    req: Request<{ id: string, x: number, y: number}>,
    res: Response<CanvasNode[] | ErrorResponseDto>
) => {

    const { id, x, y } = req.body;

    if (!id || !x || !y) {
        return res.status(400).json({ message: 'id, x, y  are required' });
    }

    try {
        const node = await CanvasNode.findOne({ where: { id: id } });

        if (!node) {
            return res.status(404).json({ message: 'Project not found' });
        }
        node.position = { x, y };

        await node.save();

        return res.status(200).json({
            message: 'node updated successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while updating node'
        });
    }
};