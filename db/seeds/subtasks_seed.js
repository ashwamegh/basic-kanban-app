/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.seed = async function(knex) {
  // Only proceed if there are no subtasks
  const subtasksExist = await knex('subtasks').first();
  if (subtasksExist) return;

  // Get all tasks to assign subtasks
  const tasks = await knex('tasks').select('id');
  
  if (tasks.length === 0) return;

  // Prepare subtasks data
  const subtasksData = [
    // Subtasks for the first task
    {
      title: 'Research pricing',
      is_completed: true,
      task_id: tasks[0].id,
      order: 0,
    },
    {
      title: 'Review competitor product',
      is_completed: false,
      task_id: tasks[0].id,
      order: 1,
    },
    {
      title: 'Finalize requirements',
      is_completed: false,
      task_id: tasks[0].id,
      order: 2,
    },
    
    // Subtasks for the second task (if it exists)
    ...(tasks.length > 1 ? [
      {
        title: 'Draft wireframes',
        is_completed: true,
        task_id: tasks[1].id,
        order: 0,
      },
      {
        title: 'Review with design team',
        is_completed: true,
        task_id: tasks[1].id,
        order: 1,
      },
      {
        title: 'Finalize mockups',
        is_completed: false,
        task_id: tasks[1].id,
        order: 2,
      },
    ] : []),
    
    // Subtasks for the third task (if it exists)
    ...(tasks.length > 2 ? [
      {
        title: 'Setup development environment',
        is_completed: true,
        task_id: tasks[2].id,
        order: 0,
      },
      {
        title: 'Create basic structure',
        is_completed: false,
        task_id: tasks[2].id,
        order: 1,
      },
    ] : []),
  ];
  
  // Insert the subtasks
  await knex('subtasks').insert(subtasksData);
}; 