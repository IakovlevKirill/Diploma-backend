import { Request, Response } from 'express';

import {Project} from "../entities/Project";
import {CanvasNode} from "../entities/CanvasNode";

import {ErrorResponseDto} from "../dto/response/errorResponse.dto";

export const getAllProjectNodesByProjectId = async (
    req: Request<{}, {}, {}, {
        projectId: string
    }>,
    res: Response<{
        result: "success" | "failure",
        data: {
            nodes: CanvasNode[]
        }
    } | ErrorResponseDto>
) => {

    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({
            result: "failure",
            message: 'projectId is required'
        });
    }

    try {

        const nodesArray = await CanvasNode.find({
            where: {
                project: { id: projectId }
            }
        });

        return res.status(200).json({
            result: "success",
            data: {
                nodes: nodesArray
            }
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Error fetching nodes for project'
        });
    }
};

export const createNode = async (
    req: Request<{}, {}, {
        id: string
        name: string,
        pointColor: string,
        projectId: string,
        position: { x: number; y: number },
        size: { width: number; height: number; },
        parentId: string,
        children: string[],
        color: string
    }>,
    res: Response<{
        result: "success" | "failure",
        data: {
            created_node: CanvasNode,
        }
    } | ErrorResponseDto>
) => {
    const { pointColor, id, projectId, position, parentId, children, name, size, color } = req.body;

    if (!pointColor || !id || !projectId || !position || !parentId || !name || !size || !color) {
        return res.status(400).json({
            result: "failure",
            message: 'Match all required fields'
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

        const old_node = await CanvasNode.findOne({ where: { id: id } });

        if (old_node) {
            return res.status(500).json({
                result: "failure",
                message: 'Node with this id already exist'
            });
        }

        const node = new CanvasNode();

        node.id = id;
        node.pointColor = pointColor;
        node.position = position;
        node.children = [];
        node.project = project;
        node.parentId = parentId;
        node.name = name;
        node.size = size;
        node.color = color;

        await node.save();

        // Если parentId не "root", обновляем родительский узел
        if (parentId !== "root") {

            const parentNode = await CanvasNode.findOne({ where: { id: parentId } });

            if (!parentNode) {
                await node.remove();
                return res.status(404).json({
                    result: "failure",
                    message: 'Parent node not found'
                });
            }

            if (!parentNode.children) {
                parentNode.children = [];
            }

            parentNode.children.push(node.id);

            await parentNode.save();
        }

        return res.status(201).json({
            result: "success",
            data: {
                created_node: node
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            result: "failure",
            message: 'Error creating node'
        });
    }
};

export const deleteNode = async (
    req: Request<{}, {}, {}, {
        nodeId: string
    }>,
    res: Response<{
        result: "success" | "failure";
        message: string;
    } | ErrorResponseDto>
) => {

    const { nodeId } = req.query;

    if (!nodeId) {
        return res.status(400).json({
            result: "failure",
            message: 'nodeId is required'
        });
    }

    try {

        const node = await CanvasNode.findOne({ where: { id: nodeId } });

        if (!node) {
            return res.status(404).json({
                result: "failure",
                message: 'Node not found'
            });
        }

        await CanvasNode.delete({ id: nodeId });

        return res.status(200).json({
            result: "success",
            message: 'Node deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Internal server error while deleting node'
        });
    }
}

export const updateNode = async (
    req: Request<{}, {}, {
        id: string
        name: string,
        pointColor: string,
        position: { x: number; y: number },
        size: { width: number; height: number; },
        parentId: string,
        children: string[],
        color: string
    }>,
    res: Response<{
        result: "success" | "failure",
        message: string
    } | ErrorResponseDto>
) => {

    const { pointColor, id, position, parentId, children, name, size, color } = req.body;

    if (!pointColor || !id || !position || !parentId || !name || !size || !color) {
        return res.status(400).json({
            result: "failure",
            message: 'Match all required fields'
        });
    }

    try {

        const node = await CanvasNode.findOne({ where: { id: id } });

        if (!node) {
            return res.status(404).json({
                result: "failure",
                message: 'Node not found'
            });
        }

        node.id = id;
        node.pointColor = pointColor;
        node.position = position;
        node.children = children;
        node.parentId = parentId;
        node.name = name;
        node.size = size;
        node.color = color;

        await node.save();

        return res.status(200).json({
            result: "success",
            message: 'Node updated successfully'
        });

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Internal server error while updating node'
        });
    }
};

export const getNodeChildren = async (
    req: Request<{}, {}, {}, {
        nodeId: string
    }> ,
    res: Response<{
        result: "success" | "failure",
        data: {
            nodes: CanvasNode[]
        }
    } | ErrorResponseDto>
) => {

    const { nodeId } = req.query;

    if (!nodeId) {
        return res.status(400).json({
            result: "failure",
            message: 'nodeId is required'
        });
    }

    try {

        if (nodeId !== "root") {

            const node = await CanvasNode.findOne({
                where: { id: nodeId }
            });

            if (node == null) {
                return res.status(404).json({
                    result: "failure",
                    message: 'node not found'
                })
            }

            const nodeChildrenIdList = node.children;

            const nodeChildren : CanvasNode[] = []

            for (let i = 0; i < nodeChildrenIdList.length; i++) {
                const node = await CanvasNode.findOne({ where: { id: nodeChildrenIdList[i] } });
                if (node != null) {
                    nodeChildren.push(node);
                }
            }

            return res.status(200).json({
                result: "success",
                data: {
                    nodes: nodeChildren
                }
            });
        }

        if (nodeId == "root") {

            const rootNodes = await CanvasNode.find({
                where: { parentId: nodeId }
            });

            return res.status(200).json({
                result: "success",
                data: {
                    nodes: rootNodes
                }
            });

        }

    } catch (error) {
        return res.status(500).json({
            result: "failure",
            message: 'Internal server error while getting node children'
        });
    }
};