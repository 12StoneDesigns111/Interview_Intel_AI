
import jwt from 'jsonwebtoken';

// Demo: user list from env or hardcoded (replace with DB for production)
const users = [
  {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD,
  },
  {
    username: process.env.FRIEND_USERNAME || 'friend',
    password: process.env.FRIEND_PASSWORD,
  },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: true, message: 'Method not allowed' });

  const { username, password } = req.body || {};
  const sessionSecret = process.env.GEMINI_SESSION_SECRET || 'dev-session-secret';

  if (!username || !password) return res.status(400).json({ error: true, message: 'Missing username or password' });

  const user = users.find(u => u.username === username && u.password && u.password === password);
  if (!user) return res.status(401).json({ error: true, message: 'Invalid credentials' });

  // Create a short-lived JWT with username
  const token = jwt.sign({ user: user.username }, sessionSecret, { expiresIn: '2h' });
  return res.status(200).json({ error: false, token, username: user.username });
}
