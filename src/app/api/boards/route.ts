import { NextRequest, NextResponse } from 'next/server';
import * as boardModel from '@/lib/models/board';
import * as columnModel from '@/lib/models/column';

// Get all boards
export async function GET() {
  try {
    const boards = await boardModel.getAll();
    return NextResponse.json(boards);
  } catch (error) {
    console.error('Failed to fetch boards:', error);
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
  }
}

// Create a new board
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.name) {
      return NextResponse.json({ error: 'Board name is required' }, { status: 400 });
    }
    
    // Create the board
    const newBoard = await boardModel.create({ name: body.name });
    
    // Create default columns for the new board
    const defaultColumns = [
      { name: 'To Do', board_id: newBoard.id, order: 1 },
      { name: 'Doing', board_id: newBoard.id, order: 2 },
      { name: 'Done', board_id: newBoard.id, order: 3 },
    ];
    
    // Create each default column
    try {
      await Promise.all(
        defaultColumns.map(column => columnModel.create(column))
      );
    } catch (columnError) {
      console.error('Failed to create default columns:', columnError);
      // Continue since the board was created successfully
    }
    
    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    console.error('Failed to create board:', error);
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
  }
} 