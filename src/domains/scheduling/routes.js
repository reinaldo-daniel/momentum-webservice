import { Router } from "express";

import {
    create, find, getById, put,
} from "./controllers";

const router = Router();

router.post("/", create);
router.get("/", find);
router.get("/:id", getById);
router.put("/:id", put);

export default router;
