/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function(knex) {
  return knex.schema.createTable('subtasks', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.boolean('is_completed').defaultTo(false);
    table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE');
    table.integer('order').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('subtasks');
}; 