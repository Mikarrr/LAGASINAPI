let jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/user/getall', {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => response.json())
        .then(data => updateUsersTable(data))
        .catch(error => console.error('Error fetching users:', error));
});

let currentUserId;

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(char => {
            return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}
function updateUsersTable(users) {
    var userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';

    users.forEach(function (user) {
        userTableBody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                
                <td>
                    <button class="admin_button" onclick="editModalUser(${user.id})">Edit</button>
                    <button class="admin_button" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function editModalUser(userId) {

    fetch(`/api/user/getbyid/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`B��d HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Wype�nij pola modala bie��cymi danymi u�ytkownika
            document.getElementById('userEmail').value = data.email;
            document.getElementById('userFirstName').value = data.firstName;
            document.getElementById('userLastName').value = data.lastName;

            // Poka� modal
            document.getElementById('userModalEdit').style.display = 'flex';
            currentUserId = userId;
        })
        .catch(error => {
            console.error('B��d podczas pobierania danych u�ytkownika:', error);
        });
}
function editUser() {
    const editedUser = {
        Email: document.getElementById('userEmail').value,
        FirstName: document.getElementById('userFirstName').value,
        LastName: document.getElementById('userLastName').value,
    };

    if (!isValidEmail(editedUser.Email)) {
        displayErrorMessage('Invalid email format.');
        return;
    }

    console.log("Edit User:", editedUser);

    fetch(`../../api/user/edit/${currentUserId}/${encodeURIComponent(editedUser.Email)}/${editedUser.FirstName}/${editedUser.LastName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => {
            closeeditModalUser();

            fetch(`/api/user/getall`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    updateUsersTable(data);
                });
        });
}


function closeeditModalUser() {
    document.getElementById('userModalEdit').style.display = 'none';
}

function deleteUser(userId) {
    if (userId) {
        fetch(`/api/user/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
        })
            .then(response => {
                if (response.ok) {
                    console.log(`User with ID ${userId} has been successfully deleted.`);
                    fetch('/api/user/getall', {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        },
                    })
                        .then(response => response.json())
                        .then(data => updateUsersTable(data))
                        .catch(error => console.error('Error fetching users:', error));
                } else {
                    console.error('Failed to delete user:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting user:', error));
    }
}

                
function isValidEmail(email) {
    // Wyra�enie regularne do walidacji adresu e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayErrorMessage(message) {
    // Wy�wietl komunikat b��du nad formularzem
    const errorMessageContainer = document.getElementById('error-message');
    errorMessageContainer.textContent = message;
    errorMessageContainer.style.display = 'block';

    // Ukryj komunikat po 4 sekundach
    setTimeout(() => {
        errorMessageContainer.textContent = '';
        errorMessageContainer.style.display = 'none';
    }, 4000);
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/products/view', {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => response.json())
        .then(data => updateProductsTable(data))
        .catch(error => console.error('Error fetching products:', error));
});


let currentProductId;
function updateProductsTable(products) {
            var productTableBody = document.getElementById('productTableBody');
            productTableBody.innerHTML = '';

            products.forEach(function (product) {
                productTableBody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>
                
                    <button class="admin_button" onclick="editModal(${product.id})">Edit</button>
                    <button class="admin_button" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `;
            });
        }

function addModal() {
    document.getElementById('productModal').style.display = 'flex';
   
}

function submitForm() {
    
    const newProduct = {
        Name: document.getElementById('productName').value,
        Price: parseInt(document.getElementById('productPrice').value),
        Description: document.getElementById('productDescription').value,
        Category: document.getElementById('productCategory').value,
        ImageUrl: document.getElementById('productUrl').value,
        ProductUrl: document.getElementById('productUrl').value,
    };

    console.log("New Product:", newProduct);

    fetch('/api/products/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`
        },
        body: JSON.stringify( newProduct ),
    })
        .then(response => {
            fetch('/api/user/getall', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                },
            })
                .then(response => {
                    fetch('/api/products/view')
                        .then(response => response.json())
                        .then(data => updateProductsTable(data))
                        .catch(error => console.error('Error fetching products:', error));
                    return response.json();
                })
                .then(data => updateUsersTable(data))
        })
        .then(data => {
            console.log(data);
            closeModal();
            
        })
        .catch(error => {
            console.error('Error adding product:', error.message);
        });
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}



function editModal(productId) {
    document.getElementById('productModalEdit').style.display = 'flex';
    currentProductId = productId;
}
function editProduct() {
    const editedProduct = {

        Name: document.getElementById('productNameEdit').value,
        Price: parseInt(document.getElementById('productPriceEdit').value),
        Description: document.getElementById('productDescriptionEdit').value,
    };

    console.log("Edit Product:", editedProduct);

    fetch(`../../api/products/edit/${currentProductId}/${editedProduct.Name}/${editedProduct.Description}/${editedProduct.Price}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => {
            fetch('/api/products/view', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                },
            })
                .then(response => response.json())
                .then(data => {
                    closeeditModal();
                    updateProductsTable(data);
                }
                );
        });
}

function closeeditModal() {
    document.getElementById('productModalEdit').style.display = 'none';
}

function deleteProduct(productId) {
    fetch(`/api/products/delete/${productId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => {
            if (response.ok) {
                console.log(`Product with ID ${productId} has been successfully deleted.`);
                fetch('/api/products/view')
                    .then(response => response.json())
                    .then(data => updateProductsTable(data))
                    .catch(error => console.error('Error fetching products:', error));
            } else {
                console.error('Failed to delete product:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting product:', error));
}

        
    
