import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "objection";

import jwtConfig from "../../config/jwtConfig";
import conflict from "../../errors/errorConflict";
import notFound from "../../errors/errorNotFound";
import preconditionFailedError from "../../errors/errorPreconditionalFailedError";
import unauthorized from "../../errors/errorUnauthorized";
import Address from "../addresses/model";
import Users from "./model";
import validations from "./validators";

const { UniqueViolationError, ForeignKeyViolationError } = pkg;

function catchCallback(error, response) {
    if (error instanceof UniqueViolationError) {
        switch (error.constraint) {
        case "users.users_email_unique":
            return conflict(response, "O email informado já está em uso.");
        case "users.users_corporate_reason_unique":
            return conflict(response, "A razão social informada já está em uso.");
        case "users.users_cnpj_unique":
            return conflict(response, "O CNPJ informado já está em uso.");
        default:
            return conflict(response);
        }
    }

    if (error instanceof ForeignKeyViolationError) {
        switch (error.constraint) {
        case "address_city_id_foreign":
            return preconditionFailedError(response, "Cidade informada não encontrada.");
        default:
            preconditionFailedError(response);
        }
    }

    return error;
}

async function refresh(request, response, next) {
    try {
        const { user } = request;

        if (!user) return unauthorized(response);

        const token = jwt.sign(user, jwtConfig.jwtSecret, { expiresIn: "7d" });

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

        await validations.loginValidation.validateAsync(body);

        const { email, password } = body;

        const user = await Users.query()
            .where("email", email)
            .where("status", true)
            .first();

        if (!user) return unauthorized(response);

        const passwordCorret = bcrypt.compareSync(password, user.password);

        if (!passwordCorret) return unauthorized(response);

        const token = jwt.sign(user.omitPassword(), jwtConfig.jwtSecret, { expiresIn: "7d" });

        response.status(200)
            .send({
                ...user.omitPassword(),
                token,
            });
    } catch (error) {
        next(error);
    }
}

async function create(request, response, next) {
    try {
        const { body, user: userRequest } = request;

        if (userRequest.user_type !== "ADMIN") return unauthorized(response);

        await validations.createValidation.validateAsync(body);

        const salt = bcrypt.genSaltSync(10);

        const hashPassword = bcrypt.hashSync(body.password, salt);

        const { address, ...userBody } = body;

        const user = await Users.transaction(async (transacting) => {
            const createdUser = await Users.query(transacting)
                .insertAndFetch({
                    ...userBody,
                    password: hashPassword,
                });

            const createdAdress = await Address.query(transacting)
                .insertAndFetch({
                    ...address,
                    user_id: createdUser.id,
                });

            return {
                ...createdUser.omitPassword(),
                address: {
                    ...createdAdress,
                },
            };
        });

        response.status(201)
            .send(user);
    } catch (error) {
        const parsedError = catchCallback(error, response);
        next(parsedError);
    }
}

async function update(request, response, next) {
    try {
        const {
            body,
            params,
            user: userRequest,
        } = request;

        if (userRequest.user_type !== "ADMIN") return unauthorized(response);

        const userId = Number(params.userId);

        if (!userId) return notFound(response);

        const userExist = await Users.query()
            .findById(userId);

        if (!userExist) return notFound(response);

        await validations.updateValidation.validateAsync(body);

        let userUpdated = {
            ...userExist,
            ...body,
        };

        if (body.password) {
            const salt = bcrypt.genSaltSync(10);

            const hashPassword = bcrypt.hashSync(body.password, salt);

            userUpdated = {
                ...userUpdated,
                password: hashPassword,
            };
        }

        const user = await Users.transaction((transacting) => {
            return Users.query(transacting)
                .updateAndFetchById(userId, userUpdated);
        });

        response.status(200)
            .send(user.omitPassword());
    } catch (error) {
        const parsedError = catchCallback(error, response);
        next(parsedError);
    }
}

async function listBranch(request, response, next) {
    try {
        const {
            query,
            user: userRequest,
        } = request;

        if (userRequest.user_type === "PROVIDER") return unauthorized(response);

        const { name, cnpj } = query;

        let usersQuery = Users.query()
            .where("user_type", "BRANCH");

        if (name) {
            usersQuery = usersQuery.where("fantasy_name", "like", `%${name}%`);
        }

        if (cnpj) {
            usersQuery = usersQuery.where("cnpj", cnpj);
        }

        const branches = await usersQuery;

        response.status(200)
            .send(branches);
    } catch (error) {
        next(error);
    }
}

async function listProvider(request, response, next) {
    try {
        const {
            query,
            user: userRequest,
        } = request;

        if (userRequest.user_type === "PROVIDER") return unauthorized(response);

        const { name, cnpj } = query;

        let usersQuery = Users.query()
            .where("user_type", "PROVIDER");

        if (name) {
            usersQuery = usersQuery.where("fantasy_name", "like", `%${name}%`);
        }

        if (cnpj) {
            usersQuery = usersQuery.where("cnpj", cnpj);
        }

        const branches = await usersQuery;

        response.status(200)
            .send(branches);
    } catch (error) {
        next(error);
    }
}

export {
    login,
    refresh,
    create,
    update,
    listBranch,
    listProvider,
};
