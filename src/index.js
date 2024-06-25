import cors from "cors";
import express from "express";
import Knex from "knex";
import multer from "multer";
import { Model } from "objection";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

import knexConfig from "../database/knexfile";
import appConfig from "./config/appConfig";
import buscaCep from "./domains/addresses/routes";
import schedules from "./domains/scheduling/routes";
import { login } from "./domains/users/controllers";
import users from "./domains/users/routes";
import authMiddleware from "./middleware/authMiddleware";
import requestLogger from "./middleware/requestLogger";

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

Model.knex(Knex(knexConfig));

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./uploads");
    },
    filename(req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });
const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post("/login", login);
app.use(authMiddleware);

app.get("/documentos/uploads/:filePath", (req, res) => {
    const filePath = path.join(path.dirname(__dirname), `uploads/${req.params.filePath}`);

    res.download(filePath);
});

app.use("/busca-cep", buscaCep);
app.use("/schedules", upload.single("nfe"), schedules);
app.use("/users", users);

app.listen(appConfig.appPort, () => {
    console.info(`Servidor rodando na porta ${appConfig.appPort}.`);
});
