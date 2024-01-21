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
    document.getElementById('userModalEdit').style.display = 'flex';
    currentUserId = userId;
}
function editUser() {

        const editedUser = {

            Email: document.getElementById('userEmail').value,
            FirstName: document.getElementById('userFirstName').value, 
            LastName: document.getElementById('userLastName').value,
        };
    console.log("Edit User:", editedUser);

    if (editedUser.Email !== null && editedUser.Email.trim() !== '') {

        fetch(`../../api/user/edit/${currentUserId}/${encodeURIComponent(editedUser.Email)}/${editedUser.FirstName}/${editedUser.LastName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
        })
            .then(response => {
                fetch('/api/user/getall', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    },
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        closeeditModalUser();
                        updateUsersTable(data);
                    })
            })
                    
    }
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

        
    
