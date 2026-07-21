const test = async () => {
  const email = `debuguser${Date.now()}@prep.pilot`
  const password = 'Password123!'

  try {
    const registerRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Debug User', email, password }),
    })
    const registerText = await registerRes.text()
    console.log('REGISTER', registerRes.status, registerText)

    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const loginText = await loginRes.text()
    console.log('LOGIN', loginRes.status, loginText)
  } catch (error) {
    console.error('ERROR', error)
  }
}

test()
