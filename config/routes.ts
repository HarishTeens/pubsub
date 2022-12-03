import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";
import schemas from "./schema";

const router = Router();


router.get("/services", controllers.services.listServices)
router.get("/services/:id")
router.put("/services", middlewares.validate(schemas.service.create), controllers.services.createService)

router.get("/orders")
router.get("/orders/:id")
router.put("/ordres")
router.post("/orders")


export default router;
