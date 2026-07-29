import { NextResponse } from 'next/server';
import { getUserData, updateUserData } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const userData = await getUserData(email);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ tasks: userData.tasks || [] }, { status: 200 });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return handleUpdateTasks(request);
}

export async function PUT(request: Request) {
  return handleUpdateTasks(request);
}

async function handleUpdateTasks(request: Request) {
  try {
    const body = await request.json();
    const { email, tasks } = body;

    if (!email || !Array.isArray(tasks)) {
      return NextResponse.json({ error: 'Email and tasks array are required' }, { status: 400 });
    }

    const userData = await getUserData(email);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await updateUserData(email, { tasks });

    return NextResponse.json({ message: 'Tasks updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
