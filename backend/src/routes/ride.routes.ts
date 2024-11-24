import { Router } from "express";
import { estimateRide, confirmRide, getRideByCustomerAndDriverIDs } from "../controllers/ride.controller";

const router = Router();

router.post(`/estimate`, estimateRide);
router.patch(`/confirm`, confirmRide);
router.get(`/:customerId`, getRideByCustomerAndDriverIDs)

export default router;