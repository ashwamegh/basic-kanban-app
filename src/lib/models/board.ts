import db from '../db';

interface Board {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface CreateBoard {
  name: string;
}

const getAll = async (): Promise<Board[]> => {
  return db('boards')
    .select('*')
    .orderBy('created_at', 'desc');
};

const getById = async (id: number): Promise<Board | null> => {
  const board = await db('boards')
    .select('*')
    .where({ id })
    .first();
  
  return board || null;
};

const create = async (data: CreateBoard): Promise<Board> => {
  const [board] = await db('boards')
    .insert(data)
    .returning('*');
  
  return board;
};

const update = async (id: number, data: Partial<CreateBoard>): Promise<Board | null> => {
  const [board] = await db('boards')
    .where({ id })
    .update(data)
    .returning('*');
  
  return board || null;
};

const remove = async (id: number): Promise<boolean> => {
  const deletedCount = await db('boards')
    .where({ id })
    .del();
  
  return deletedCount > 0;
};

export type { Board, CreateBoard };
export { getAll, getById, create, update, remove }; 