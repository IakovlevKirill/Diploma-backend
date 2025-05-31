import {Router} from "express";
import {
    createNode,
    deleteNode,
    updateNode,
    getNodesByProjectId
} from '../controllers/node.controller';

const router = Router();

// @ts-ignore
router.get('/api/project/nodes/get', getNodesByProjectId );
// @ts-ignore
router.post('/api/project/node/create', createNode);
// @ts-ignore
router.delete('/api/project/node/delete', deleteNode);
// @ts-ignore
router.post('/api/project/node/update', updateNode);

export default router;