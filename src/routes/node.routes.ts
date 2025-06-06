import {Router} from "express";
import {
    createNode,
    deleteNode,
    updateNode,
    getAllProjectNodesByProjectId,
    getNodeChildren,
} from '../controllers/node.controller';

const router = Router();

// @ts-ignore
router.get('/api/project/nodes/get', getAllProjectNodesByProjectId );
// @ts-ignore
router.post('/api/project/node/create', createNode);
// @ts-ignore
router.delete('/api/project/node/delete', deleteNode);
// @ts-ignore
router.post('/api/project/node/update', updateNode);
// @ts-ignore
router.get('/api/project/node/get/children', getNodeChildren);

export default router;