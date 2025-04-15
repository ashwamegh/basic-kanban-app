/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tasks').del();
  await knex('columns').del();
  await knex('boards').del();

  // Insert boards
  const [platformLaunchBoard, marketingPlanBoard, roadmapBoard] = await knex('boards').insert([
    { name: 'Platform Launch' },
    { name: 'Marketing Plan' },
    { name: 'Roadmap' }
  ]).returning('*');

  // Create columns for Platform Launch board
  const [plTodoColumn, plDoingColumn, plDoneColumn] = await knex('columns').insert([
    { name: 'TODO', board_id: platformLaunchBoard.id, order: 1 },
    { name: 'DOING', board_id: platformLaunchBoard.id, order: 2 },
    { name: 'DONE', board_id: platformLaunchBoard.id, order: 3 }
  ]).returning('*');

  // Create columns for Marketing Plan board
  const [mpTodoColumn, mpDoingColumn, mpDoneColumn] = await knex('columns').insert([
    { name: 'TODO', board_id: marketingPlanBoard.id, order: 1 },
    { name: 'DOING', board_id: marketingPlanBoard.id, order: 2 },
    { name: 'DONE', board_id: marketingPlanBoard.id, order: 3 }
  ]).returning('*');

  // Create columns for Roadmap board
  const [rmTodoColumn, rmDoingColumn, rmDoneColumn] = await knex('columns').insert([
    { name: 'TODO', board_id: roadmapBoard.id, order: 1 },
    { name: 'DOING', board_id: roadmapBoard.id, order: 2 },
    { name: 'DONE', board_id: roadmapBoard.id, order: 3 }
  ]).returning('*');

  // Platform Launch board tasks
  const platformLaunchTasks = [
    // TODO column tasks
    { 
      title: 'Build UI for onboarding flow', 
      description: 'Create UI screens for onboarding process', 
      column_id: plTodoColumn.id, 
      order: 1,
    },
    { 
      title: 'Build UI for search', 
      description: 'Create UI components for search functionality', 
      column_id: plTodoColumn.id, 
      order: 2,
    },
    { 
      title: 'Build settings UI', 
      description: 'Create interface for app settings', 
      column_id: plTodoColumn.id, 
      order: 3,
    },
    { 
      title: 'QA and test all major user journeys', 
      description: 'Ensure all user paths work correctly', 
      column_id: plTodoColumn.id, 
      order: 4,
    },
    
    // DOING column tasks
    { 
      title: 'Design settings and search pages', 
      description: 'Create designs for settings and search functionality', 
      column_id: plDoingColumn.id, 
      order: 1,
    },
    { 
      title: 'Add account management endpoints', 
      description: 'Develop API endpoints for account operations', 
      column_id: plDoingColumn.id, 
      order: 2,
    },
    { 
      title: 'Design onboarding flow', 
      description: 'Create designs for user onboarding', 
      column_id: plDoingColumn.id, 
      order: 3,
    },
    { 
      title: 'Add search endpoints', 
      description: 'Develop API endpoints for search functionality', 
      column_id: plDoingColumn.id, 
      order: 4,
    },
    { 
      title: 'Add authentication endpoints', 
      description: 'Develop API endpoints for user authentication', 
      column_id: plDoingColumn.id, 
      order: 5,
    },
    { 
      title: 'Research pricing points of various competitors and trial different business models', 
      description: 'Study competition pricing strategies', 
      column_id: plDoingColumn.id, 
      order: 6,
    },
    
    // DONE column tasks
    { 
      title: 'Conduct 5 wireframe tests', 
      description: 'Test wireframes with users', 
      column_id: plDoneColumn.id, 
      order: 1,
    },
    { 
      title: 'Create wireframe prototype', 
      description: 'Build initial wireframe prototype', 
      column_id: plDoneColumn.id, 
      order: 2,
    },
    { 
      title: 'Review results of usability tests and iterate', 
      description: 'Analyze test results and make improvements', 
      column_id: plDoneColumn.id, 
      order: 3,
    },
    { 
      title: 'Create paper prototypes and conduct 10 usability tests with potential customers', 
      description: 'Test paper prototypes with potential users', 
      column_id: plDoneColumn.id, 
      order: 4,
    },
    { 
      title: 'Market discovery', 
      description: 'Research market needs and opportunities', 
      column_id: plDoneColumn.id, 
      order: 5,
    },
    { 
      title: 'Competitor analysis', 
      description: 'Research and analyze competitors', 
      column_id: plDoneColumn.id, 
      order: 6,
    },
    { 
      title: 'Research the market', 
      description: 'Study market trends and requirements', 
      column_id: plDoneColumn.id, 
      order: 7,
    }
  ];

  // Marketing Plan board tasks
  const marketingPlanTasks = [
    // TODO column tasks
    { 
      title: 'Create social media campaign', 
      description: 'Develop social media strategy and content', 
      column_id: mpTodoColumn.id, 
      order: 1,
    },
    { 
      title: 'Develop email newsletter', 
      description: 'Design templates and plan content schedule', 
      column_id: mpTodoColumn.id, 
      order: 2,
    },
    { 
      title: 'Create promotional video', 
      description: 'Produce a short video highlighting key features', 
      column_id: mpTodoColumn.id, 
      order: 3,
    },
    
    // DOING column tasks
    { 
      title: 'SEO optimization', 
      description: 'Optimize website content for search engines', 
      column_id: mpDoingColumn.id, 
      order: 1,
    },
    { 
      title: 'Plan product launch event', 
      description: 'Organize virtual launch event with demos', 
      column_id: mpDoingColumn.id, 
      order: 2,
    },
    
    // DONE column tasks
    { 
      title: 'Market research', 
      description: 'Complete analysis of target audience', 
      column_id: mpDoneColumn.id, 
      order: 1,
    },
    { 
      title: 'Brand identity development', 
      description: 'Finalize logo and brand guidelines', 
      column_id: mpDoneColumn.id, 
      order: 2,
    }
  ];

  // Roadmap board tasks
  const roadmapTasks = [
    // TODO column tasks
    { 
      title: 'API integration with third-party services', 
      description: 'Add integrations with popular productivity tools', 
      column_id: rmTodoColumn.id, 
      order: 1,
    },
    { 
      title: 'Mobile app development', 
      description: 'Create native mobile applications', 
      column_id: rmTodoColumn.id, 
      order: 2,
    },
    { 
      title: 'Enterprise features', 
      description: 'Develop advanced security and admin features', 
      column_id: rmTodoColumn.id, 
      order: 3,
    },
    
    // DOING column tasks
    { 
      title: 'Improve performance', 
      description: 'Optimize load times and responsiveness', 
      column_id: rmDoingColumn.id, 
      order: 1,
    },
    { 
      title: 'User feedback implementation', 
      description: 'Address top user requests from feedback forum', 
      column_id: rmDoingColumn.id, 
      order: 2,
    },
    
    // DONE column tasks
    { 
      title: 'Core functionality', 
      description: 'Complete essential features for MVP', 
      column_id: rmDoneColumn.id, 
      order: 1,
    },
    { 
      title: 'Initial user testing', 
      description: 'Complete first round of beta testing', 
      column_id: rmDoneColumn.id, 
      order: 2,
    }
  ];

  // Insert all tasks at once
  await knex('tasks').insert([
    ...platformLaunchTasks,
    ...marketingPlanTasks,
    ...roadmapTasks
  ]);
}; 