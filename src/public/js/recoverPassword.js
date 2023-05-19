const email = document.getElementById("recover-email")
const form = document.getElementById("recover-password")



form.addEventListener("submit", async (e) => {
    e.preventDefault();
  
 
  
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({email:email.value}),
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
  