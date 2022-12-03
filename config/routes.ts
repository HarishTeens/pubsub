import { Router } from "express";
import controllers from "../controllers";

const router = Router();


router.get("/services", controllers.services.listServices)
router.get("/services/:id")
router.put("/services")

router.get("/orders")
router.get("/orders/:id")
router.put("/ordres")
router.post("/orders")


router.get("/:address/nonce")


export default router;
