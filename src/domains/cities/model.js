import { Model } from "objection";

import State from "../states/model";

class City extends Model {
    static get tableName() {
        return "cities";
    }

    static get idColumn() {
        return "id";
    }

    static get relationMappings() {
        return {
            state: {
                relation: City.BelongsToOneRelation,
                modelClass: State,
                join: {
                    from: "cities.state_id",
                    to: "states.id",
                },
            },
        };
    }
}

export default City;
