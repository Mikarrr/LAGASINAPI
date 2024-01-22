


function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('B³¹d podczas parsowania tokena JWT:', error);
        return {};
    }
}


document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
  
    fetch('../api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
        }),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorData => {
                    const errorMessage = document.createElement('div');
                    errorMessage.innerHTML = errorData;
                    errorMessage.style.color = 'white';
                    errorMessage.style.fontSize = '14px';
                    errorMessage.style.fontFamily = 'Montserrat';
                    document.getElementById('error_message').appendChild(errorMessage);

                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 4000);

                    throw new Error(`HTTP error! Status: ${response.status}, Error: ${errorData}`);
                });
            }
            return response.text();
        })
        .then(data => {
            console.log('Login successful:', data);

            localStorage.setItem('jwtToken', data);

            const parsedJwt = parseJwt(data);
            console.log(parsedJwt);

            const userRole = parsedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

            const successMessage = document.createElement('div');
            successMessage.innerHTML = 'Login successful!';
            successMessage.style.color = 'white';
            successMessage.style.fontSize = '14px';
            successMessage.style.fontFamily = 'Montserrat';
            document.getElementById('success_message').appendChild(successMessage);
            console.log(userRole);
            setTimeout(() => {
                successMessage.style.display = 'none';
    
                if (userRole === 'Administrator') {
                    window.location.href = 'pages_admin/admin_index.html';
                } 
                if (userRole === 'User') {
                    window.location.href = 'pages_user/user_index.html';
                } 
            }, 4000);
        })
        .catch(error => {

            console.error('Login failed:', error.message);
        });


});



