const USER_TYPE = {
    ADMIN: "ADMIN",
    BRANCH: "BRANCH",
    PROVIDER: "PROVIDER",
};

export const up = function up(knex) {
    return knex.schema.createTable("users", (table) => {
        table.bigIncrements("id")
            .primary();

        table.string("fantasy_name", 255)
            .notNullable();

        table.string("corporate_reason", 255)
            .unique()
            .notNullable();

        table.string("email", 100)
            .unique()
            .notNullable();

        table.string("password", 100)
            .notNullable();

        table.string("phone_number", 20)
            .notNullable()
            .index();

        table.string("cnpj", 14)
            .unique()
            .notNullable();

        table.enum("user_type", Object.values(USER_TYPE))
            .defaultTo(USER_TYPE.BRANCH)
            .notNullable();

        table.bool("status")
            .notNullable()
            .defaultTo(true);

        table.timestamps(false, true);
    });
};

export const down = function down(knex) {
    return knex.schema.dropTable("users");
};
