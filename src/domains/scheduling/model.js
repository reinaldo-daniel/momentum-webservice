import { Model } from "objection";

class Scheduling extends Model {
    static get tableName() {
        return "schedules";
    }

    static get idColumn() {
        return "id";
    }
}

export default Scheduling;
