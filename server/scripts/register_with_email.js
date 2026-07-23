(async () => {
  try {
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    const email = process.argv[2];
    const password = process.argv[3] || 'TestPass123!';
    const name = process.argv[4] || 'E2E Register';
    if (!email) {
      console.error('Usage: node register_with_email.js email@example.com [password] [name]');
      process.exit(2);
    }
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json().catch(()=>null);
    console.log('STATUS', res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('ERR', err.message || err);
    process.exitCode = 2;
  }
})();
