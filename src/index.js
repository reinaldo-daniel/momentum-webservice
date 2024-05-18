import cors from "cors";
import express from "express";
import Knex from "knex";
import { Model } from "objection";

import knexConfig from "../database/knexfile";
import appConfig from "./config/appConfig";
import { login } from "./domains/users/controllers";
import users from "./domains/users/routes";
import authMiddleware from "./middleware/authMiddleware";
import requestLogger from "./middleware/requestLogger";

Model.knex(Knex(knexConfig));

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post("/login", login);

app.use(authMiddleware);

app.use("/users", users);

app.listen(appConfig.appPort, () => {
    console.info(`Servidor rodando na porta ${appConfig.appPort}.`);
});
