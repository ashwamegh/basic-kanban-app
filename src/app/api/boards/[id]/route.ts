import { NextRequest, NextResponse } from 'next/server';
import * as boardModel from '@/lib/models/board';

interface Params {
  params: {
    id: string;
  };
}

// Get a single board
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const idParam = params.id;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid board ID' }, { status: 400 });
    }
    
    const board = await boardModel.getById(id);
    
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    
    return NextResponse.json(board);
  } catch (error) {
    console.error(`Failed to fetch board:`, error);
    return NextResponse.json({ error: 'Failed to fetch board' }, { status: 500 });
  }
}

// Update a board
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const idParam = params.id;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid board ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate request
    if (!body.name) {
      return NextResponse.json({ error: 'Board name is required' }, { status: 400 });
    }
    
    const updatedBoard = await boardModel.update(id, { name: body.name });
    
    if (!updatedBoard) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error(`Failed to update board:`, error);
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
  }
}

// Delete a board
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const idParam = params.id;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid board ID' }, { status: 400 });
    }
    
    const deleted = await boardModel.remove(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete board:`, error);
    return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
  }
} 