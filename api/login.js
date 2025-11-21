import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: true, message: 'Method not allowed' });

  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.GEMINI_SESSION_SECRET || 'dev-session-secret';

  if (!adminPassword) return res.status(500).json({ error: true, message: 'Server not configured for login' });
  if (!password) return res.status(400).json({ error: true, message: 'Missing password' });

  if (password !== adminPassword) return res.status(401).json({ error: true, message: 'Invalid credentials' });

  // Create a short-lived JWT
  const token = jwt.sign({ user: 'admin' }, sessionSecret, { expiresIn: '2h' });
  return res.status(200).json({ error: false, token });
}
