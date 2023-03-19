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

  console.log("useeeeeeeeeeeeeeeeeeeeer", user);
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const user = await res.json();
    let userId = user._doc._id;
    window.location.replace(`/user-profile?id=${userId}`);
  }
});

githubLogin.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/auth/githubLogin", {
      method: "GET",
      credentials: "include", // this is needed to include the user's session cookie in the request
    });

    if (response.redirected) {
      window.location.href = response.url; // redirect to the home page after successful authentication
    }
  } catch (error) {
    console.error(error);
  }
});
