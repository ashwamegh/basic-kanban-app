import { NextRequest, NextResponse } from 'next/server';
import * as subtaskModel from '@/lib/models/subtask';

interface Params {
  params: {
    id: string;
  };
}

// Get a single subtask by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const subtaskId = parseInt(params.id);
    
    if (isNaN(subtaskId)) {
      return NextResponse.json({ error: 'Invalid subtask ID' }, { status: 400 });
    }
    
    const subtask = await subtaskModel.getById(subtaskId);
    
    if (!subtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    }
    
    return NextResponse.json(subtask);
  } catch (error) {
    console.error(`Failed to fetch subtask ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch subtask' }, { status: 500 });
  }
}

// Update a subtask
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const subtaskId = parseInt(params.id);
    
    if (isNaN(subtaskId)) {
      return NextResponse.json({ error: 'Invalid subtask ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate request
    if (body.title === '') {
      return NextResponse.json({ error: 'Subtask title cannot be empty' }, { status: 400 });
    }
    
    const subtask = await subtaskModel.getById(subtaskId);
    
    if (!subtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    }
    
    const updatedSubtask = await subtaskModel.update(subtaskId, {
      title: body.title !== undefined ? body.title : subtask.title,
      is_completed: body.is_completed !== undefined ? body.is_completed : subtask.is_completed
    });
    
    return NextResponse.json(updatedSubtask);
  } catch (error) {
    console.error(`Failed to update subtask ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 });
  }
}

// Toggle subtask completion status
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const subtaskId = parseInt(params.id);
    
    if (isNaN(subtaskId)) {
      return NextResponse.json({ error: 'Invalid subtask ID' }, { status: 400 });
    }
    
    const subtask = await subtaskModel.getById(subtaskId);
    
    if (!subtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    }
    
    const updatedSubtask = await subtaskModel.toggleCompletion(subtaskId);
    return NextResponse.json(updatedSubtask);
  } catch (error) {
    console.error(`Failed to toggle subtask ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to toggle subtask completion' }, { status: 500 });
  }
}

// Delete a subtask
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const subtaskId = parseInt(params.id);
    
    if (isNaN(subtaskId)) {
      return NextResponse.json({ error: 'Invalid subtask ID' }, { status: 400 });
    }
    
    const success = await subtaskModel.remove(subtaskId);
    
    if (!success) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete subtask ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 });
  }
} 