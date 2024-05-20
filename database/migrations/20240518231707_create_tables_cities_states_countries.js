import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/* eslint-disable no-underscore-dangle */

const cities = JSON.parse(fs.readFileSync(`${__dirname}/../seeds/cities.json`, "utf8"));
const countries = JSON.parse(fs.readFileSync(`${__dirname}/../seeds/countries.json`, "utf8"));
const states = JSON.parse(fs.readFileSync(`${__dirname}/../seeds/states.json`, "utf8"));

export const up = async function up(knex) {
    await knex.schema.createTable("countries", (table) => {
        table.bigIncrements("id")
            .primary();

        table.specificType("acronym", "char(2)")
            .notNullable();

        table.string("name", 100)
            .notNullable()
            .index();

        table.timestamps(false, true);
    });

    await knex("countries").insert(countries);

    await knex.schema.createTable("states", (table) => {
        table.bigIncrements("id")
            .primary();

        table.bigInteger("country_id")
            .unsigned()
            .references("countries.id");

        table.integer("ibge_code", 10)
            .notNullable();

        table.specificType("acronym", "char(2)")
            .notNullable()
            .index();

        table.string("name", 100)
            .notNullable()
            .index();

        table.string("ddd", 50);

        table.string("time_zone", 50)
            .notNullable();

        table.timestamps(false, true);
    });

    await knex("states").insert(states);

    await knex.schema.createTable("cities", (table) => {
        table.bigIncrements("id")
            .primary();

        table.bigInteger("state_id")
            .unsigned()
            .notNullable()
            .references("states.id");

        table.integer("ibge_code", 10)
            .notNullable();

        table.string("name", 200)
            .notNullable()
            .index();

        table.string("time_zone", 10);

        table.timestamps(false, true);
    });

    await knex("cities").insert(cities);
};

export const down = async function down(knex) {
    await knex.schema.dropTableIfExists("cities");
    await knex.schema.dropTableIfExists("states");
    await knex.schema.dropTableIfExists("countries");
};
