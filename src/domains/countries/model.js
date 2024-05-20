import { Model } from "objection";

class Country extends Model {
    static get tableName() {
        return "countries";
    }

    static get idColumn() {
        return "id";
    }
}

export default Country;
