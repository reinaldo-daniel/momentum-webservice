const STATUS = {
    AG_CONFIRMACAO: "AG_CONFIRMACAO",
    AG_ENTREGA: "AG_ENTREGA",
    CANCELADO: "CANCELADO",
    ENTREGUE: "ENTREGUE",
};

export const up = async function up(knex) {
    await knex.schema.createTable("attachments", (table) => {
        table.bigIncrements("id")
            .primary();

        table.string("mimetype", 255)
            .notNullable();

        table.bigInteger("file_size")
            .unsigned()
            .notNullable();

        table.string("file_path", 1000)
            .notNullable();

        table.string("original_name", 1000)
            .notNullable();

        table.integer("image_width", 10);
        table.integer("image_height", 10);

        table.timestamps(false, true);

        table.dateTime("deleted_at")
            .index();
    });

    await knex.schema.createTable("schedules", (table) => {
        table.bigIncrements("id")
            .primary()
            .notNullable();

        table.enum("status", Object.values(STATUS))
            .defaultTo(STATUS.AG_CONFIRMACAO)
            .notNullable();

        table.string("description", 255);

        table.bigInteger("attachment_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("attachments");

        table.bigInteger("branch_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users");

        table.bigInteger("provider_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users");

        table.dateTime("date")
            .index();
    });
};

export const down = async function down(knex) {
    await knex.schema.alterTable("schedules", (table) => {
        table.dropForeign(["provider_id"]);
        table.dropForeign(["branch_id"]);
        table.dropForeign(["attachment_id"]);
    });

    await knex.schema.dropTable("attachments");
    await knex.schema.dropTable("schedules");
};
