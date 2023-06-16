const token = document.getElementById('token');
const form = document.getElementById('token-form')


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(token.value)
  const obj = {token:token.value}
  console.log(obj)
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
    console.log(res)
    if (res.ok) {
      window.location.href = res.url;
    }
  } catch (error) {
    console.log(error);
  }
});

