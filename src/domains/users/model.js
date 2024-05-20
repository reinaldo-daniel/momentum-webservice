import { Model } from "objection";

class Users extends Model {
    static get tableName() {
        return "users";
    }

    static get idColumn() {
        return "id";
    }

    get $hiddenFields() {
        return ["password"];
    }

    omitPassword() {
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }
}

export default Users;
