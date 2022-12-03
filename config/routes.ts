import { Router } from "express";

const router = Router();


router.get("/services")
router.get("/services/:id")
router.put("/services")

router.get("/orders")
router.get("/orders/:id")
router.put("/ordres")
router.post("/orders")


router.put("/user/auth")


export default router;
