import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { Project } from '../entities/Project';
import { buildGraphAndCluster } from './clusteringService';
import { ErrorResponseDto } from '../dto/response/errorResponse.dto';
import { User } from '../entities/User';

// Настройка multer для загрузки файла
const upload = multer({ dest: 'uploads/' });

export const createProjectWithClustering = [
    upload.single('file'), // middleware для получения файла
    async (
        req: Request<{}, {}, {}, {
            userId: string,
            projectTitle: string,
        }>,
        res: Response<
            | {
            result: 'success';
            data: {
                projectId: string;
                analytics: any;
            };
        }
            | ErrorResponseDto
        >
    ) => {
        const file = req.file;
        const { userId, projectTitle } = req.query;

        await new Promise(resolve => setTimeout(resolve, 8000));

        if (!file) {
            return res.status(400).json({
                result: 'failure',
                message: 'File is required',
            });
        }

        if (!userId) {
            return res.status(400).json({
                result: 'failure',
                message: 'User ID is required',
            });
        }

        if (!projectTitle) {
            return res.status(400).json({
                result: 'failure',
                message: 'ProjectTitle is required',
            });
        }

        try {
            // Читаем содержимое файла
            const fileBuffer = await fs.readFile(file.path, 'utf-8');
            const nodesData = JSON.parse(fileBuffer);

            // Удаляем временный файл после чтения
            await fs.unlink(file.path);

            console.log('nodesData', nodesData);

            console.log('начинаю кластеризацию');

            // Выполняем кластеризацию и строим дерево
            const { nodes, analytics } = await buildGraphAndCluster(nodesData);

            console.log(nodes, analytics, "процесс кластеризации завершен");

            if (!nodes || nodes.length === 0) {
                return res.status(500).json({
                    result: 'failure',
                    message: 'Clusterization module error',
                });
            }

            const user = await User.findOneBy({ id: userId });

            if (!user) {
                return res.status(404).json({
                    result: 'failure',
                    message: 'User not found',
                });
            }

            const project = new Project();

            project.user = user;
            project.title = projectTitle;
            project.nodes = nodes;

            await project.save();

            console.log("проект создан");

            return res.status(201).json({
                result: 'success',
                data: {
                    projectId: project.id,
                    analytics,
                },
            });
        } catch (error) {
            console.error('Error during clustering:', error);
            return res.status(500).json({
                result: 'failure',
                message: 'Internal server error while processing the file',
            });
        }
    },
];