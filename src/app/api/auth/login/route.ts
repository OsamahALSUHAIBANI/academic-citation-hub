import { NextResponse } from 'next/server';
import { getProfiles, getUserData } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    const profiles = await getProfiles();
    const user = profiles.find(
      p => p.email.toLowerCase() === cleanEmail && p.password === cleanPassword
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const userData = await getUserData(cleanEmail);

    return NextResponse.json({ message: 'Login successful', user: userData }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
