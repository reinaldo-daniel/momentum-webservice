import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import jwtConfig from "../../config/jwtConfig";
import unauthorized from "../../errors/errorUnauthorized";
import Users from "./model";

async function refresh(request, response, next) {
    try {
        const { user } = request;

        if (!user) return unauthorized(response);

        const userToResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const token = jwt.sign(userToResponse, jwtConfig.jwtSecret, { expiresIn: "7d" });

        response.status(200)
            .send({
                ...user,
                token,
            });
    } catch (error) {
        next(error);
    }
}

async function login(request, response, next) {
    try {
        const { body } = request;
        const { email, password } = body;

        const user = await Users.query()
            .where("email", email)
            .where("status", true)
            .first();

        if (!user) return unauthorized(response);

        const passwordCorret = bcrypt.compareSync(password, user.password);

        if (!passwordCorret) return unauthorized(response);

        const userToResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const token = jwt.sign(userToResponse, jwtConfig.jwtSecret, { expiresIn: "7d" });

        response.status(200)
            .send({
                ...userToResponse,
                token,
            });
    } catch (error) {
        next(error);
    }
}

export {
    login,
    refresh,
};
