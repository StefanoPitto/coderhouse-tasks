const email = document.getElementById("recover-email")
const form = document.getElementById("recover-password")



form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try{
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({email:email.value}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log('res',res)
      if(res.ok){
        Swal.fire('Token Sent', 'Token has been sent to the email', 'info');
      }
    }
    catch(error){
      Swal.fire('Error!','Error, please contact an admin','error')
    }
  });
  