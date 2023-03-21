const form = document.getElementById("signup-form");
const name = document.getElementById("signup-name");
const email = document.getElementById("signup-email");
const password = document.getElementById("signup-password");
const age = document.getElementById("signup-age");
const address = document.getElementById("signup-address");
const role = document.getElementById("signup-role");
const githubAccount = document.getElementById("github-create-account");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let user = {
    name: name.value,
    email: email.value,
    password: password.value,
    age: parseInt(age.value),
    address: address.value,
    role: role.value,
  };

  const res = await fetch("/api/auth/", {
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

githubAccount.addEventListener("click", (e) => {
  e.preventDefault();
});
