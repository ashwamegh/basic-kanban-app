/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.integer('column_id').unsigned().references('id').inTable('columns').onDelete('CASCADE');
    table.integer('order').notNullable();
    table.integer('subtasks_count').defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
}; 