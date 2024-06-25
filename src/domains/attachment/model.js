import { Model } from "objection";

class Attachment extends Model {
    static get tableName() {
        return "attachments";
    }

    static get idColumn() {
        return "id";
    }
}

export default Attachment;
