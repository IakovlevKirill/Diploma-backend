import { Request, Response } from 'express';

import {Project} from "../entities/Project";
import {CanvasNode} from "../entities/CanvasNode";

import {ErrorResponseDto} from "../dto/response/errorResponse.dto";

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