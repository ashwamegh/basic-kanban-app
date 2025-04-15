import db from '@/lib/db';

export interface Subtask {
  id: number;
  title: string;
  is_completed: boolean;
  task_id: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubtask {
  title: string;
  is_completed?: boolean;
  task_id: number;
  order: number;
}

// Get all subtasks by task ID
export async function getByTaskId(taskId: number): Promise<Subtask[]> {
  return db('subtasks')
    .where({ task_id: taskId })
    .orderBy('order', 'asc');
}

// Get a subtask by ID
export async function getById(id: number): Promise<Subtask | null> {
  const subtasks = await db('subtasks').where({ id }).limit(1);
  return subtasks.length ? subtasks[0] : null;
}

// Create a new subtask
export async function create(subtask: CreateSubtask): Promise<Subtask> {
  const [newSubtask] = await db('subtasks').insert(subtask).returning('*');

  return newSubtask;
}

// Update a subtask
export async function update(id: number, updates: Partial<Subtask>): Promise<Subtask | null> {
  const [updatedSubtask] = await db('subtasks')
    .where({ id })
    .update(updates)
    .returning('*');
  
  return updatedSubtask || null;
}

// Toggle subtask completion
export async function toggleCompletion(id: number): Promise<Subtask | null> {
  const subtask = await getById(id);
  if (!subtask) return null;
  
  const [updatedSubtask] = await db('subtasks')
    .where({ id })
    .update({ is_completed: !subtask.is_completed })
    .returning('*');
  
  return updatedSubtask;
}

// Delete a subtask
export async function remove(id: number): Promise<boolean> {
  const subtask = await getById(id);
  if (!subtask) return false;
  
  await db('subtasks').where({ id }).delete();
  
  return true;
}

// Reorder subtasks within a task
export async function reorder(
  taskId: number, 
  subtaskIds: number[]
): Promise<Subtask[]> {
  // Update each subtask's order based on its position in the subtaskIds array
  const updatePromises = subtaskIds.map((id, index) => {
    return db('subtasks')
      .where({ id, task_id: taskId })
      .update({ order: index });
  });
  
  await Promise.all(updatePromises);
  
  // Return the updated subtasks
  return getByTaskId(taskId);
} 