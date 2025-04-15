import { NextRequest, NextResponse } from 'next/server';
import * as taskModel from '@/lib/models/task';

interface Params {
  params: {
    id: string;
  };
}

// Get a single task
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    
    const task = await taskModel.getById(id);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error(`Failed to fetch task ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// Update a task
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate request
    if (!body.title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }
    
    // Only update fields that were provided
    const updateData: Partial<taskModel.CreateTask> = {
      title: body.title
    };
    
    if (body.description !== undefined) {
      updateData.description = body.description;
    }
    
    if (body.column_id !== undefined) {
      updateData.column_id = body.column_id;
    }
    
    if (body.order !== undefined) {
      updateData.order = body.order;
    }
    
    
    const updatedTask = await taskModel.update(id, updateData);
    
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(`Failed to update task ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// Delete a task
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    
    const deleted = await taskModel.remove(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete task ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
} 