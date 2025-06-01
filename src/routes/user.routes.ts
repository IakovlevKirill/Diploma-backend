import {
    changeUserPassword,
    getUserById
} from "../controllers/user.controller";
import {Router} from "express";

const router = Router();

// @ts-ignore
router.post('/api/user/change/password', changeUserPassword)
// @ts-ignore
router.get('/api/user/get', getUserById)

export default router;