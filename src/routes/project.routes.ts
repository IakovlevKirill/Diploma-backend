import {Router} from "express";
import {
    createProject,
    deleteProject,
    getAllProjects,
    getProjectById,
    pinProject,
    getPinnedProjects,
    changeProjectTitle
} from '../project/project.controller';

const router = Router();

/**
 * @swagger
 * /api/project/create:
 *   post:
 *     summary: Создание проекта
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Проект успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
// @ts-ignore
router.post('/api/project/create', createProject );

/**
 * @swagger
 * /api/project/get:
 *   get:
 *     summary: Получить проект по id
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Проект найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 ownerId:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *
 */
// @ts-ignore
router.get('/api/project/get', getProjectById );

/**
 * @swagger
 * /api/project/get/all:
 *   get:
 *     summary: Получить все проекты конкретного юзера
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Проект найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 ownerId:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *
 */
// @ts-ignore
router.get('/api/project/get/all', getAllProjects );

/**
 * @swagger
 * /api/project/delete:
 *   delete:
 *     summary: Удалить проект
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Проект найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                     type: boolean
 *                  message:
 *                     type: string
 *
 *
 */
// @ts-ignore
router.delete('/api/project/delete', deleteProject );

/**
 * @swagger
 * /api/project/pin:
 *   post:
 *     summary: Пин проекта
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Проект успешно запинен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   message: string
 */
// @ts-ignore
router.post('/api/project/pin', pinProject );

/**
 * @swagger
 * /api/project/get/pinned:
 *   get:
 *     summary: Получить pinned проекты
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Проект найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *
 *
 */
// @ts-ignore
router.get('/api/project/get/pinned', getPinnedProjects );
// @ts-ignore
router.post('/api/project/change/title', changeProjectTitle );

export default router;