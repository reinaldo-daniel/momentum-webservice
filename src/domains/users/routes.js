import { Router } from "express";

import {
    create, find, refresh, update,
} from "./controllers";

const router = Router();

router.put("/refresh", refresh);
router.post("/", create);
router.put("/:userId", update);
router.get("/", find);

export default router;
