const age = document.getElementById("age");
const name = document.getElementById("name");
const email = document.getElementById("email");
const role = document.getElementById("role");
const address = document.getElementById("address");
const logoutBtn = document.getElementById("logout-btn");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

(() => {
  if (!id) window.location.replace("/");
})();

(getUserProfile = async () => {
  const res = await fetch(`/api/auth/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }

  const user = await res.json();
  updateFields(user);
  console.log("USERPROFILE", user);

  return user;
})();

updateFields = (user) => {
  name.innerHTML = user.name;
  email.innerHTML = user.email;
  age.innerHTML = user.age;
  role.innerHTML = user.role;
  address.innerHTML = user.address;
};

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (res.ok) {
    window.location.replace("/");
  } else {
    const errorMessage = await res.text();
    console.error(errorMessage);
  }
});
