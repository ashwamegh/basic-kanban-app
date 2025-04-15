import { NextRequest, NextResponse } from 'next/server';
import * as columnModel from '@/lib/models/column';
import * as boardModel from '@/lib/models/board';

interface Params {
  params: {
    id: string;
  };
}

// Get columns by board ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const idParam = params.id;
    const boardId = parseInt(idParam);
    
    if (isNaN(boardId)) {
      return NextResponse.json({ error: 'Invalid board ID' }, { status: 400 });
    }
    
    // Check if board exists
    const board = await boardModel.getById(boardId);
    
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    
    const columns = await columnModel.getByBoardId(boardId);
    return NextResponse.json(columns);
  } catch (error) {
    console.error(`Failed to fetch columns for board:`, error);
    return NextResponse.json({ error: 'Failed to fetch columns' }, { status: 500 });
  }
}

// Create a column in a board
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const idParam = params.id;
    const boardId = parseInt(idParam);
    
    if (isNaN(boardId)) {
      return NextResponse.json({ error: 'Invalid board ID' }, { status: 400 });
    }
    
    // Check if board exists
    const board = await boardModel.getById(boardId);
    
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Validate request
    if (!body.name) {
      return NextResponse.json({ error: 'Column name is required' }, { status: 400 });
    }
    
    // Get current max order
    const columns = await columnModel.getByBoardId(boardId);
    const maxOrder = columns.length > 0 
      ? Math.max(...columns.map(col => col.order))
      : 0;
    
    const newColumn = await columnModel.create({
      name: body.name,
      board_id: boardId,
      order: maxOrder + 1
    });
    
    return NextResponse.json(newColumn, { status: 201 });
  } catch (error) {
    console.error(`Failed to create column in board:`, error);
    return NextResponse.json({ error: 'Failed to create column' }, { status: 500 });
  }
} 