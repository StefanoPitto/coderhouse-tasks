const token = document.getElementById('token');
const form = document.getElementById('token-form')


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`/api/auth/reset-password`, {
      method: 'POST',
      body:JSON.stringify({token:token.value})
    });
    console.log(res, "res");
    if (res.ok) {
      window.location.href = res.url;
    }
  } catch (error) {
    console.log(error);
  }
});

