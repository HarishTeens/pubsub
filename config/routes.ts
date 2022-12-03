import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";
import schemas from "./schema";

const router = Router();


router.get("/services", controllers.services.listServices)
router.get("/services/:id")
router.put("/services", middlewares.validate(schemas.service.create), controllers.services.createService)

router.get("/orders", controllers.orders.listOrders)
router.get("/orders/:id")
router.put("/orders", middlewares.validate(schemas.order.create), controllers.orders.placeOrder);
router.post("/orders") // UPDATE Status


export default router;
