import express from "express";
import {
    createProjectWithClustering
} from "./clusterization.controller";

const router = express.Router();
// @ts-ignore
router.post('/api/project/create-with-clustering', createProjectWithClustering);

export default router;