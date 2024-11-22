import { Router } from "express";
import { estimateRide } from "../controllers/ride.controller";

const router = Router();

router.post(`/estimate`, estimateRide);

export default router;