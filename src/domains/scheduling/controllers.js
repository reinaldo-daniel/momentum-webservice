import notFound from "../../errors/errorNotFound";
import preconditionFailedError from "../../errors/errorPreconditionalFailedError";
import Attachment from "../attachment/model";
import Users from "../users/model";
import Scheduling from "./model";

// LEMBRAR DE VERIFICAR SE NÃO EXISTE UM AGENDAMENTO NA MESMA DATA PARA FILIAL

async function create(request, response, next) {
    try {
        const { body, file } = request;
        const {
            description, status,
            filial: branchId, fornecedor: providerId, date,
        } = body;

        const provider = await Users.query()
            .where("id", providerId)
            .where("user_type", "PROVIDER")
            .where("status", true)
            .first();

        const branch = await Users.query()
            .where("id", branchId)
            .where("user_type", "BRANCH")
            .where("status", true)
            .first();

        if (!provider || !branch) return preconditionFailedError(response, "Filial ou fornecedor inválidos");

        const currentDate = new Date();
        const providedDate = new Date(date);
        const diffInDays = Math.ceil((providedDate - currentDate) / (1000 * 60 * 60 * 24));

        if (diffInDays < 2) {
            return preconditionFailedError(response, "A data deve ser pelo menos dois dias à frente da data atual");
        }

        const scheduling = await Scheduling.transaction(async (transacting) => {
            const { id: attachmentId } = await Attachment.query(transacting)
                .insertAndFetch({
                    mimetype: file.mimetype,
                    file_size: file.size,
                    file_path: file.path,
                    original_name: file.originalname,
                });

            return Scheduling.query(transacting)
                .insertAndFetch({
                    status,
                    description,
                    attachment_id: attachmentId,
                    branch_id: branchId,
                    provider_id: providerId,
                    date: providedDate.toISOString().split("T")[0],
                });
        });

        response.send(scheduling);
    } catch (error) {
        next(error);
    }
}

async function find(request, response, next) {
    try {
        const scheduling = await Scheduling.query()
            .select("schedules.*", "branch.fantasy_name as branch", "provider.fantasy_name as provider")
            .join("users as branch", "schedules.branch_id", "branch.id")
            .join("users as provider", "schedules.provider_id", "provider.id");

        response.send(scheduling);
    } catch (error) {
        next(error);
    }
}

async function getById(request, response, next) {
    try {
        const { params } = request;

        const schedulingId = Number(params.id);

        if (!schedulingId) return notFound(response);

        const schedulingExist = await Scheduling.query()
            .select("schedules.*", "branch.id as branchId", "provider.id as providerId", "attachments.file_path")
            .where("schedules.id", schedulingId)
            .join("users as branch", "schedules.branch_id", "branch.id")
            .join("attachments", "schedules.attachment_id", "attachments.id")
            .join("users as provider", "schedules.provider_id", "provider.id")
            .first();

        if (!schedulingExist) return notFound(response);

        response.send(schedulingExist);
    } catch (error) {
        next(error);
    }
}

async function put(request, response, next) {
    try {
        const { body, params, file } = request;
        const {
            description, status,
            filial: branchId, fornecedor: providerId, date,
        } = body;

        const schedulingId = Number(params.id);

        if (!schedulingId) return notFound(response);

        const currentDate = new Date();
        const providedDate = new Date(date);
        const diffInDays = Math.ceil((providedDate - currentDate) / (1000 * 60 * 60 * 24));

        if (diffInDays < 2) {
            return preconditionFailedError(response, "A data deve ser pelo menos dois dias à frente da data atual");
        }

        const scheduling = await Scheduling.transaction(async (transacting) => {
            if (file) {
                const { id: attachmentId } = await Attachment.query(transacting)
                    .insertAndFetch({
                        mimetype: file.mimetype,
                        file_size: file.size,
                        file_path: file.path,
                        original_name: file.originalname,
                    });

                return Scheduling.query(transacting)
                    .updateAndFetchById(schedulingId, {
                        status,
                        description,
                        attachment_id: attachmentId,
                        branch_id: branchId,
                        provider_id: providerId,
                        date: providedDate.toISOString().split("T")[0],
                    });
            }

            return Scheduling.query(transacting)
                .updateAndFetchById(schedulingId, {
                    status,
                    description,
                    branch_id: branchId,
                    provider_id: providerId,
                    date: providedDate.toISOString().split("T")[0],
                });
        });
        response.send(scheduling);
    } catch (error) {
        next(error);
    }
}

export {
    create,
    find,
    getById,
    put,
};
