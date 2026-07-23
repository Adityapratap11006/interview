(async () => {
  try {
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    const email = process.argv[2];
    const password = process.argv[3] || 'TestPass123!';
    if (!email) {
      console.error('Usage: node login_with_email.js email@example.com [password]');
      process.exit(2);
    }
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(()=>null);
    console.log('STATUS', res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('ERR', err.message || err);
    process.exitCode = 2;
  }
})();
