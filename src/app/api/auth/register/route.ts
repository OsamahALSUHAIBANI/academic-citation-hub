import { NextResponse } from 'next/server';
import { appendProfile, getProfiles, createUserData } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, dateOfBirth } = body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Valid email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name ? String(name).trim() : '';
    const cleanDob = dateOfBirth ? String(dateOfBirth).trim() : '';

    const profiles = await getProfiles();
    const exists = profiles.some(p => p.email.toLowerCase() === cleanEmail);
    if (exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    await appendProfile(cleanEmail, cleanPassword);
    const userData = await createUserData(cleanEmail, { name: cleanName, dateOfBirth: cleanDob }, []);

    return NextResponse.json(
      { message: 'User registered successfully', user: userData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
