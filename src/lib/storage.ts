import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.csv');
const USERDATA_FILE = path.join(DATA_DIR, 'userdata.json');

// Ensure the data directory exists
export async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// --------------------------------------------------------
// profiles.csv operations
// --------------------------------------------------------

export interface Profile {
  email: string;
  password: string;
}

export async function appendProfile(email: string, password: string): Promise<void> {
  await ensureDataDir();
  
  try {
    let fileExists = true;
    try {
      const stats = await fs.stat(PROFILES_FILE);
      if (stats.size === 0) {
        fileExists = false;
      }
    } catch {
      fileExists = false;
    }

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const row = `${cleanEmail},${cleanPassword}\n`;
    
    if (!fileExists) {
      await fs.writeFile(PROFILES_FILE, `email,password\n${row}`, 'utf8');
    } else {
      await fs.appendFile(PROFILES_FILE, row, 'utf8');
    }
  } catch (error) {
    console.error('Error appending profile:', error);
    throw new Error('Failed to append profile');
  }
}

export async function getProfiles(): Promise<Profile[]> {
  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    
    // Remove header if present
    if (lines.length > 0 && lines[0].toLowerCase().startsWith('email,password')) {
      lines.shift();
    }
    
    return lines.map(line => {
      const [email, password] = line.split(',');
      return { email: email?.trim() || '', password: password?.trim() || '' };
    });
  } catch (error: any) {
    // If file doesn't exist or error reading, safely return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading profiles:', error);
    return [];
  }
}

// --------------------------------------------------------
// userdata.json operations
// --------------------------------------------------------

export interface UserData {
  email: string;
  profileInfo?: Record<string, any>;
  tasks?: any[];
  [key: string]: any;
}

export async function getAllUserData(): Promise<Record<string, UserData>> {
  try {
    const data = await fs.readFile(USERDATA_FILE, 'utf8');
    if (!data.trim()) {
      return {};
    }
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error('Error reading user data:', error);
    return {};
  }
}

export async function getUserData(email: string): Promise<UserData | null> {
  try {
    const allData = await getAllUserData();
    return allData[email.trim()] || null;
  } catch (error) {
    console.error('Error getting user data for email:', email, error);
    return null;
  }
}

export async function createUserData(
  email: string,
  profileInfo?: Record<string, any>,
  tasks?: any[]
): Promise<UserData> {
  await ensureDataDir();
  const cleanEmail = email.trim();
  const allData = await getAllUserData();
  
  const newUserData: UserData = {
    email: cleanEmail,
    profileInfo: profileInfo || {},
    tasks: tasks || [],
  };

  allData[cleanEmail] = newUserData;
  
  try {
    await fs.writeFile(USERDATA_FILE, JSON.stringify(allData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating user data:', error);
    throw new Error('Failed to create user data');
  }

  return newUserData;
}

export async function updateUserData(email: string, data: Partial<UserData>): Promise<void> {
  await ensureDataDir();
  
  try {
    const cleanEmail = email.trim();
    const allData = await getAllUserData();
    
    if (!allData[cleanEmail]) {
      allData[cleanEmail] = { email: cleanEmail, ...data };
    } else {
      allData[cleanEmail] = { ...allData[cleanEmail], ...data };
    }
    
    await fs.writeFile(USERDATA_FILE, JSON.stringify(allData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data');
  }
}
