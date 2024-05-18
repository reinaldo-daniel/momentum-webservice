const ROLES = {
    ADM: "ADM",
    EMPLOYEE: "EMPLOYEE",
};

export const up = function up(knex) {
    return knex.schema.createTable("users", (table) => {
        table.bigIncrements("id")
            .primary();

        table.string("name", 255)
            .notNullable();

        table.enum("role", Object.values(ROLES))
            .defaultTo(ROLES.EMPLOYEE)
            .notNullable();

        table.bool("status")
            .notNullable()
            .defaultTo(true);

        table.string("email", 100)
            .unique()
            .notNullable();

        table.string("password", 100)
            .notNullable();
    });
};

export const down = function down(knex) {
    return knex.schema.dropTable("users");
};
