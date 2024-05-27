import { Router } from "express";

import {
    create, refresh, update, listBranch,
    listProvider,
} from "./controllers";

const router = Router();

router.put("/refresh", refresh);
router.post("/", create);
router.put("/:userId", update);
router.get("/list-branch", listBranch);
router.get("/list-provider", listProvider);

export default router;
