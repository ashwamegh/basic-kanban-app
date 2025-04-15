import db from '@/lib/db';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  column_id: number;
  order: number;
  created_at: string;
  updated_at: string;
  subtasks_count?: number;
}

export interface CreateTask {
  title: string;
  description?: string;
  column_id: number;
  order: number;
}

export async function getByColumnId(columnId: number): Promise<Task[]> {
  const tasks = await db('tasks')
    .where({ column_id: columnId })
    .orderBy('order', 'asc');
    
  // Count subtasks for each task
  for (const task of tasks) {
    const subtasksCount = await db('subtasks')
      .where({ task_id: task.id })
      .count('id as count')
      .first();
      
    task.subtasks_count = subtasksCount ? Number(subtasksCount.count) : 0;
  }
  
  return tasks;
}

export async function getById(id: number): Promise<Task | null> {
  const tasks = await db('tasks').where({ id }).limit(1);
  
  if (!tasks.length) return null;
  
  const task = tasks[0];
  
  // Count subtasks
  const subtasksCount = await db('subtasks')
    .where({ task_id: task.id })
    .count('id as count')
    .first();
    
  task.subtasks_count = subtasksCount ? Number(subtasksCount.count) : 0;
  
  return task;
}

export async function create(task: CreateTask): Promise<Task> {
  const [newTask] = await db('tasks').insert({
    title: task.title,
    description: task.description || null,
    column_id: task.column_id,
    order: task.order,
  }).returning('*');
  
  return newTask;
}

export async function update(id: number, updates: Partial<Task>): Promise<Task | null> {
  // Remove subtasks_count from updates as it's calculated on the fly
  const taskUpdates = { ...updates };
  
  const [updatedTask] = await db('tasks')
    .where({ id })
    .update(taskUpdates)
    .returning('*');
  
  if (!updatedTask) return null;
  
  // Count subtasks
  const subtasksCount = await db('subtasks')
    .where({ task_id: id })
    .count('id as count')
    .first();
    
  updatedTask.subtasks_count = subtasksCount ? Number(subtasksCount.count) : 0;
  
  return updatedTask;
}

export async function remove(id: number): Promise<boolean> {
  await db('tasks').where({ id }).delete();
  return true;
} 