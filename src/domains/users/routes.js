import { Router } from "express";

import {
    create, refresh, update, listBranch,
    listProvider, profile, get,
} from "./controllers";

const router = Router();

router.put("/refresh", refresh);
router.post("/", create);
router.put("/:userId", update);
router.get("/profile", profile);
router.get("/list-branch", listBranch);
router.get("/list-provider", listProvider);
router.get("/:userId", get);

export default router;
