import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

// Ensure db.json exists
function initDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], uploads: [] }, null, 2));
  }
}

export function getData() {
  initDb();
  try {
    const fileContent = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading db.json', error);
    return { users: [], uploads: [] };
  }
}

export function saveData(data) {
  initDb();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to db.json', error);
  }
}

export function findUserByEmail(email) {
  const data = getData();
  return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser({ name, email, password }) {
  const data = getData();
  if (data.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User already exists');
  }
  const newUser = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    password, // note: in production use bcrypt, but for this demo a simple store is fine
    createdAt: new Date().toISOString()
  };
  data.users.push(newUser);
  saveData(data);
  return newUser;
}
