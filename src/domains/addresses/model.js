import { Model } from "objection";

import City from "../cities/model";

class Address extends Model {
    static get tableName() {
        return "address";
    }

    static get idColumn() {
        return "id";
    }

    static get relationMappings() {
        return {
            city: {
                relation: Address.BelongsToOneRelation,
                modelClass: City,
                join: {
                    from: "address.city_id",
                    to: "cities.id",
                },
            },
        };
    }
}

export default Address;
