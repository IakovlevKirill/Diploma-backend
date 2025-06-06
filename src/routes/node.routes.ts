import {Router} from "express";
import {
    createNode,
    deleteNode,
    updateNode,
    getProjectRootNodesByProjectId,
    getNodeChildren,
} from '../controllers/node.controller';

const router = Router();

// @ts-ignore
router.get('/api/project/nodes/get', getProjectRootNodesByProjectId );
// @ts-ignore
router.post('/api/project/node/create', createNode);
// @ts-ignore
router.delete('/api/project/node/delete', deleteNode);
// @ts-ignore
router.post('/api/project/node/update', updateNode);
// @ts-ignore
router.get('/api/project/node/get/children', getNodeChildren);

export default router;