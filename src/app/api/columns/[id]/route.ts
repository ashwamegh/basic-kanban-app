import { NextRequest, NextResponse } from 'next/server';
import * as columnModel from '@/lib/models/column';

interface Params {
  params: {
    id: string;
  };
}

// Get a single column
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid column ID' }, { status: 400 });
    }
    
    const column = await columnModel.getById(id);
    
    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    
    return NextResponse.json(column);
  } catch (error) {
    console.error(`Failed to fetch column ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch column' }, { status: 500 });
  }
}

// Update a column
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid column ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate request
    if (!body.name) {
      return NextResponse.json({ error: 'Column name is required' }, { status: 400 });
    }
    
    const updatedColumn = await columnModel.update(id, { name: body.name });
    
    if (!updatedColumn) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedColumn);
  } catch (error) {
    console.error(`Failed to update column ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update column' }, { status: 500 });
  }
}

// Delete a column
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid column ID' }, { status: 400 });
    }
    
    const deleted = await columnModel.remove(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete column ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete column' }, { status: 500 });
  }
} 