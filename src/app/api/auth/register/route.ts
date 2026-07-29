import { NextResponse } from 'next/server';
import { appendProfile, getProfiles, updateUserData } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, dateOfBirth } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const profiles = await getProfiles();
    const exists = profiles.some(p => p.email === email);
    if (exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    await appendProfile(email, password);
    await updateUserData(email, { profileInfo: { name, dateOfBirth }, tasks: [] });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
