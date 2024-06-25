export const up = function up(knex) {
    return knex.schema.createTable("address", (table) => {
        table.bigIncrements("id")
            .primary();

        table.string("street", 200);

        table.string("number", 50);

        table.string("complement", 50);

        table.string("cep", 8);

        table.string("district", 200);

        table.bigInteger("user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users");

        table.string("city", 100)
            .notNullable()
            .index();

        table.string("state", 100)
            .notNullable()
            .index();

        table.timestamps(false, true);
        table.dateTime("deleted_at")
            .index();
    });
};

export const down = function down(knex) {
    return knex.schema.dropTableIfExists("address");
};
