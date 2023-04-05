const form = document.getElementById("login-form");
const email = document.getElementById("login-email");
const password = document.getElementById("login-password");
const githubLogin = document.getElementById("github-login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let user = {
    email: email.value,
    password: password.value,
  };

  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    window.location.href = res.url;
  }
});
