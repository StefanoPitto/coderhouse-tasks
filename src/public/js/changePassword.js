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
          console.log('response',response)
        // Show success alert and redirect on success
        Swal.fire('Success', 'Password updated successfully', 'success').then(() => {
          window.location.href = response.url;
        });
      } else {
        // Show error alert on failure
        Swal.fire('Error', 'Failed to update password', 'error');
      }
    } catch (error) {
      // Show error alert on exception
      Swal.fire('Error', 'An error occurred', 'error');
      console.error(error);
    }
}
});

function getTokenFromURL() {
  // Implement your logic to extract the token from the URL
  // You can use URLSearchParams or a regular expression to extract the token
  // Example implementation using URLSearchParams:
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('token');
}
