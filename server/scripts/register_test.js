(async () => {
  try {
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    const timestamp = Date.now();
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'E2E Test ' + timestamp, email: `e2e+${timestamp}@example.com`, password: 'TestPass123!' })
    });
    const data = await res.json();
    console.log('STATUS', res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('ERR', err.message || err);
    process.exitCode = 2;
  }
})();
