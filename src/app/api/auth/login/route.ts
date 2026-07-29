import { NextResponse } from 'next/server';
import { getProfiles, getUserData } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const profiles = await getProfiles();
    const user = profiles.find(p => p.email === email && p.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userData = await getUserData(email);

    return NextResponse.json({ message: 'Login successful', user: userData }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
