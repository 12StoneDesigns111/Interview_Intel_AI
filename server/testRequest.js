import fetch from 'node-fetch';

async function run() {
  try {
    const res = await fetch('http://localhost:3001/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Google' })
    });
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', text);
  } catch (err) {
    console.error('Request failed', err);
  }
}

run();
