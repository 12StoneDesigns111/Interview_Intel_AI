
// Auth removed: always succeed
export default async function handler(req, res) {
  return res.status(200).json({ error: false, message: 'Auth disabled' });
}
