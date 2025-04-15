import { NextRequest, NextResponse } from 'next/server';
import * as taskModel from '@/lib/models/task';
import * as columnModel from '@/lib/models/column';

interface Params {
  params: {
    id: string;
  };
}

// Get tasks by column ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const columnId = parseInt(params.id);
    
    if (isNaN(columnId)) {
      return NextResponse.json({ error: 'Invalid column ID' }, { status: 400 });
    }
    
    // Check if column exists
    const column = await columnModel.getById(columnId);
    
    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    
    const tasks = await taskModel.getByColumnId(columnId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(`Failed to fetch tasks for column ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// Create a task in a column
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const columnId = parseInt(params.id);
    
    if (isNaN(columnId)) {
      return NextResponse.json({ error: 'Invalid column ID' }, { status: 400 });
    }
    
    // Check if column exists
    const column = await columnModel.getById(columnId);
    
    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Validate request
    if (!body.title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }
    
    // Get current max order
    const tasks = await taskModel.getByColumnId(columnId);
    const maxOrder = tasks.length > 0 
      ? Math.max(...tasks.map(task => task.order))
      : 0;
    
    const newTask = await taskModel.create({
      title: body.title,
      description: body.description || '',
      column_id: columnId,
      order: maxOrder + 1,
      subtasks_count: body.subtasks_count || 0
    });
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error(`Failed to create task in column ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
} 