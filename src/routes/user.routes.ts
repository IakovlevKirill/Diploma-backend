import {changeUserPassword} from "../user/user.controller";
import {Router} from "express";

const router = Router();

// @ts-ignore
router.post('/api/user/change/password', changeUserPassword)

export default router;