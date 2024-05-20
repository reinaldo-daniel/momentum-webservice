import { Model } from "objection";

import Country from "../countries/model";

class State extends Model {
    static get tableName() {
        return "states";
    }

    static get idColumn() {
        return "id";
    }

    static get relationMappings() {
        return {
            country: {
                relation: State.BelongsToOneRelation,
                modelClass: Country,
                join: {
                    from: "states.country_id",
                    to: "countries.id",
                },
            },
        };
    }
}

export default State;
