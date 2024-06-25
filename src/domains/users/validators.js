import Joi from "joi";

const USER_TYPE = {
    ADMIN: "ADMIN",
    BRANCH: "BRANCH",
    PROVIDER: "PROVIDER",
};

const loginValidation = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .lowercase(),

    password: Joi.string()
        .trim()
        .min(6)
        .max(200),
});

const userCreate = Joi.object({
    fantasy_name: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required(),

    corporate_reason: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .max(200)
        .required(),

    password: Joi.string()
        .trim()
        .min(6)
        .max(80)
        .required(),

    phone_number: Joi.string()
        .min(10)
        .pattern(/^[0-9]+$/)
        .required(),

    cnpj: Joi.string()
        .length(14)
        .pattern(/^[0-9]+$/)
        .required(),

    user_type: Joi.string()
        .valid(...Object.values(USER_TYPE))
        .required(),

    address: Joi.when(
        Joi.ref("user_type"),
        {
            is: [USER_TYPE.BRANCH, USER_TYPE.PROVIDER],
            then: Joi.object({
                city: Joi.string()
                    .max(100),

                state: Joi.string()
                    .max(100),

                street: Joi.string()
                    .max(200)
                    .required(),

                number: Joi.string()
                    .max(50)
                    .required(),

                complement: Joi.string()
                    .max(50),

                cep: Joi.string()
                    .length(8)
                    .required(),

                district: Joi.string()
                    .max(200)
                    .required(),
            })
                .required(),
        },
    ),

});

const userUpdate = Joi.object({
    fantasy_name: Joi.string()
        .trim()
        .min(3)
        .max(255),

    corporate_reason: Joi.string()
        .trim()
        .min(3)
        .max(255),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .max(200),

    currentPassword: Joi.string()
        .trim()
        .min(6)
        .max(80),

    newPassword: Joi.string()
        .trim()
        .min(6)
        .max(80),

    phone_number: Joi.string()
        .min(10)
        .pattern(/^[0-9]+$/),

    user_type: Joi.string()
        .valid(...Object.values(USER_TYPE)),

    cnpj: Joi.string()
        .length(14)
        .pattern(/^[0-9]+$/),

    status: Joi.boolean(),

    address: Joi.when(
        Joi.ref("user_type"),
        {
            is: [USER_TYPE.BRANCH, USER_TYPE.PROVIDER],
            then: Joi.object({
                city: Joi.string()
                    .max(100),

                state: Joi.string()
                    .max(100),

                street: Joi.string()
                    .max(200),

                number: Joi.string()
                    .max(50),

                complement: Joi.string()
                    .max(50),

                cep: Joi.string()
                    .length(8),

                district: Joi.string()
                    .max(200),
            })
                .required(),
        },
    ),
});

export default {
    loginValidation,
    createValidation: userCreate,
    updateValidation: userUpdate,
};
