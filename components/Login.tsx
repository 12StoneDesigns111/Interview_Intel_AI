import React, { useState } from 'react';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setError(data?.message || 'Login failed');
        return;
      }
      const token = data.token;
      localStorage.setItem('iit_token', token);
      onLogin();
    } catch (err: any) {
      setError(err?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h3 className="text-lg font-bold mb-4">Sign In</h3>
        <label className="block text-sm mb-2">Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border px-3 py-2 rounded mb-3" autoFocus />
        <label className="block text-sm mb-2">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded mb-3" />
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <div className="flex items-center justify-between">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
          <button type="button" onClick={() => { setUsername(''); setPassword(''); setError(null); }} className="text-sm text-slate-500 underline">Clear</button>
        </div>
      </form>
    </div>
  );
};
