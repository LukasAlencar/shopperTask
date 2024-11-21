import { Router } from "express";
import { estimateRide } from "../controllers/ride.controller";

const router = Router();

router.get('/estimate', estimateRide);

export default router;