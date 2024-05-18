import Joi from "joi";

// const ROLES = {
//     ADM: "ADM",
//     EMPLOYEE: "EMPLOYEE",
// };

const loginUserSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .lowercase(),

    password: Joi.string()
        .trim()
        .min(6)
        .max(200),
});

export default {
    loginUserSchema,
};
