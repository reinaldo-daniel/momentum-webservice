import Joi from "joi";

const querySchema = Joi.object({
    cep: Joi.string()
        .length(8)
        .allow(null, "")
        .required(),
});

export default querySchema;
