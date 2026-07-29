import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.csv');
const USERDATA_FILE = path.join(DATA_DIR, 'userdata.json');

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// --------------------------------------------------------
// profiles.csv operations
// --------------------------------------------------------
export async function appendProfile(email: string, password: string) {
  await ensureDataDir();
  
  try {
    let fileExists = true;
    try {
      await fs.access(PROFILES_FILE);
    } catch {
      fileExists = false;
    }

    const row = `${email},${password}\n`;
    
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

export async function getProfiles(): Promise<{ email: string; password: string }[]> {
  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    
    // Remove header
    if (lines.length > 0 && lines[0].startsWith('email,password')) {
      lines.shift();
    }
    
    return lines.map(line => {
      const [email, password] = line.split(',');
      return { email, password };
    });
  } catch (error: any) {
    // If file doesn't exist, return empty array
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
  const allData = await getAllUserData();
  return allData[email] || null;
}

export async function updateUserData(email: string, data: Partial<UserData>): Promise<void> {
  await ensureDataDir();
  
  try {
    const allData = await getAllUserData();
    
    if (!allData[email]) {
      allData[email] = { email, ...data };
    } else {
      allData[email] = { ...allData[email], ...data };
    }
    
    await fs.writeFile(USERDATA_FILE, JSON.stringify(allData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data');
  }
}
