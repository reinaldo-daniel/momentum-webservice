import { Router } from "express";

import { refresh } from "./controllers";

const router = Router();

router.put("/refresh", refresh);

export default router;
