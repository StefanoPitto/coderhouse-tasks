const form = document.getElementById('change-password-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password === confirmPassword) {
    const token = getTokenFromURL(); // Implement your logic to extract token from the URL
    const data = { password, token };
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Password changed successfully
        window.location.href = '/success-page'; // Redirect to success page
      } else {
        // Handle error case
        const errorData = await response.json();
        console.log(errorData.msg);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    errorMessage.style.display = 'block';
  }
});

function getTokenFromURL() {
  // Implement your logic to extract the token from the URL
  // You can use URLSearchParams or a regular expression to extract the token
  // Example implementation using URLSearchParams:
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('token');
}
