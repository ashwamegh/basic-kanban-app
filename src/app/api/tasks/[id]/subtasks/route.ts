import { NextRequest, NextResponse } from 'next/server';
import * as subtaskModel from '@/lib/models/subtask';
import * as taskModel from '@/lib/models/task';

interface Params {
  params: {
    id: string;
  };
}

// Get all subtasks for a task
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    
    // Check if task exists
    const task = await taskModel.getById(taskId);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    const subtasks = await subtaskModel.getByTaskId(taskId);
    return NextResponse.json(subtasks);
  } catch (error) {
    console.error(`Failed to fetch subtasks for task ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch subtasks' }, { status: 500 });
  }
}

// Create a new subtask for a task
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    
    // Check if task exists
    const task = await taskModel.getById(taskId);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Validate request
    if (!body.title) {
      return NextResponse.json({ error: 'Subtask title is required' }, { status: 400 });
    }
    
    // Get current max order
    const subtasks = await subtaskModel.getByTaskId(taskId);
    const maxOrder = subtasks.length > 0 
      ? Math.max(...subtasks.map(subtask => subtask.order))
      : 0;
    
    const newSubtask = await subtaskModel.create({
      title: body.title,
      is_completed: false,
      task_id: taskId,
      order: maxOrder + 1
    });
    
    return NextResponse.json(newSubtask, { status: 201 });
  } catch (error) {
    console.error(`Failed to create subtask for task ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to create subtask' }, { status: 500 });
  }
}

// Reorder subtasks
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate request
    if (!body.subtaskIds || !Array.isArray(body.subtaskIds)) {
      return NextResponse.json({ error: 'Subtask IDs array is required' }, { status: 400 });
    }
    
    const updatedSubtasks = await subtaskModel.reorder(taskId, body.subtaskIds);
    return NextResponse.json(updatedSubtasks);
  } catch (error) {
    console.error(`Failed to reorder subtasks for task ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to reorder subtasks' }, { status: 500 });
  }
} 