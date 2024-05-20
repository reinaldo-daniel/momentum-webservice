import { Router } from "express";

import buscaCep from "./controller";

const router = Router();

router.post("/", buscaCep);

export default router;
