import axios from "axios";

import preconditionFailedError from "../../errors/errorPreconditionalFailedError";
import querySchema from "./validators";

async function buscaCep(request, response, next) {
    try {
        const { query } = request;

        await querySchema.validateAsync(query);

        const { cep } = query;

        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (!data) return null;

        if (data.erro === true) return preconditionFailedError(response, "CEP não encontrado ou inválido.");

        const logradouro = {
            ...data,
        };

        response.status(200)
            .json(logradouro);
    } catch (error) {
        next(error);
    }
}

export default buscaCep;
