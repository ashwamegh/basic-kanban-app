import db from '../db';

interface Task {
  id: number;
  title: string;
  description: string | null;
  column_id: number;
  order: number;
  subtasks_count: number;
  created_at: Date;
  updated_at: Date;
}

interface CreateTask {
  title: string;
  description?: string;
  column_id: number;
  order: number;
  subtasks_count?: number;
}

const getByColumnId = async (columnId: number): Promise<Task[]> => {
  return db('tasks')
    .select('*')
    .where({ column_id: columnId })
    .orderBy('order', 'asc');
};

const getById = async (id: number): Promise<Task | null> => {
  const task = await db('tasks')
    .select('*')
    .where({ id })
    .first();
  
  return task || null;
};

const create = async (data: CreateTask): Promise<Task> => {
  const [task] = await db('tasks')
    .insert(data)
    .returning('*');
  
  return task;
};

const update = async (id: number, data: Partial<CreateTask>): Promise<Task | null> => {
  const [task] = await db('tasks')
    .where({ id })
    .update(data)
    .returning('*');
  
  return task || null;
};

const remove = async (id: number): Promise<boolean> => {
  const deletedCount = await db('tasks')
    .where({ id })
    .del();
  
  return deletedCount > 0;
};

export type { Task, CreateTask };
export { getByColumnId, getById, create, update, remove }; 