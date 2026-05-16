import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tripsRouter from "./trips";
import savedTripsRouter from "./savedTrips";
import preferencesRouter from "./preferences";

const router: IRouter = Router();

router.use(healthRouter);
router.use(tripsRouter);
router.use(savedTripsRouter);
router.use(preferencesRouter);

export default router;
