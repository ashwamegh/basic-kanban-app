/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function(knex) {
  return knex.schema.createTable('columns', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('board_id').unsigned().references('id').inTable('boards').onDelete('CASCADE');
    table.integer('order').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('columns');
}; 