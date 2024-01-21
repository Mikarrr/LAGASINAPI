document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

  
    if (formData.get('email') !== formData.get('confirmEmail')) {
      
        const successMessage = document.createElement('div');
        successMessage.innerHTML = 'Emails do not match!';
        successMessage.style.color = 'white';
        successMessage.style.fontSize = '14px';
        successMessage.style.fontFamily = 'Montserrat';
        document.getElementById('success_message').appendChild(successMessage);

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 4000);

        return;
    }

    if (formData.get('password') !== formData.get('confirmPassword')) {
      
        const successMessage = document.createElement('div');
        successMessage.innerHTML = 'Passwords do not match!';
        successMessage.style.color = 'white';
        successMessage.style.fontSize = '14px';
        successMessage.style.fontFamily = 'Montserrat';
        document.getElementById('success_message').appendChild(successMessage);

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 4000);

        return;
    }

    if (!isPasswordValid(formData.get('password'))) {

        const successMessage = document.createElement('div');
        successMessage.innerHTML = 'Password must be at least 8 characters long and contain at least one uppercase letter, one special character, and one digit!';
        successMessage.style.color = 'white';
        successMessage.style.fontSize = '14px';
        successMessage.style.fontFamily = 'Montserrat';
        document.getElementById('success_message').appendChild(successMessage);

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 4000);

        return;
    }

    fetch('../api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            confirmEmail: formData.get('confirmEmail'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            acceptTermsAndConditions: formData.get('acceptTerms') === 'on',
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
            console.log('Registration successful:', data);

            const successMessage = document.createElement('div');
            successMessage.innerHTML = 'Registration successful, please verify your account, on email!';
            successMessage.style.color = 'white';
            successMessage.style.fontSize = '14px';
            successMessage.style.fontFamily = 'Montserrat';
            document.getElementById('success_message').appendChild(successMessage);


            setTimeout(() => {
                successMessage.style.display = 'none';
                window.location.href = 'login.html';
            }, 4000);
        })
        .catch(error => {
            console.error('Registration failed:', error.message);
        });
});


function isPasswordValid(password) {
   
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
}