import db from '../db';

interface Column {
  id: number;
  name: string;
  board_id: number;
  order: number;
  created_at: Date;
  updated_at: Date;
}

interface CreateColumn {
  name: string;
  board_id: number;
  order: number;
}

const getByBoardId = async (boardId: number): Promise<Column[]> => {
  return db('columns')
    .select('*')
    .where({ board_id: boardId })
    .orderBy('order', 'asc');
};

const getById = async (id: number): Promise<Column | null> => {
  const column = await db('columns')
    .select('*')
    .where({ id })
    .first();
  
  return column || null;
};

const create = async (data: CreateColumn): Promise<Column> => {
  const [column] = await db('columns')
    .insert(data)
    .returning('*');
  
  return column;
};

const update = async (id: number, data: Partial<CreateColumn>): Promise<Column | null> => {
  const [column] = await db('columns')
    .where({ id })
    .update(data)
    .returning('*');
  
  return column || null;
};

const remove = async (id: number): Promise<boolean> => {
  const deletedCount = await db('columns')
    .where({ id })
    .del();
  
  return deletedCount > 0;
};

export type { Column, CreateColumn };
export { getByBoardId, getById, create, update, remove }; 