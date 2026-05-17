import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tripsRouter from "./trips";
import savedTripsRouter from "./savedTrips";
import preferencesRouter from "./preferences";
import searchHistoryRouter from "./searchHistory";
import subscriptionRouter from "./subscription";

const router: IRouter = Router();

router.use(healthRouter);
router.use(tripsRouter);
router.use(savedTripsRouter);
router.use(preferencesRouter);
router.use(searchHistoryRouter);
router.use(subscriptionRouter);

export default router;
