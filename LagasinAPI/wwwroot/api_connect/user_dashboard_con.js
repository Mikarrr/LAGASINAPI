const jwtToken = localStorage.getItem('jwtToken');
document.addEventListener('DOMContentLoaded', () => {



    const decodedToken = parseJwt(jwtToken);

    if (decodedToken) {
        const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        fetch(`/api/user/getbyid/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                console.log(data);
                updateUsersTable(data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    } else {
        console.error('Error decoding JWT token.');
       
    }
});


document.addEventListener('DOMContentLoaded', () => {



    const decodedToken = parseJwt(jwtToken);

    if (decodedToken) {
        const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        fetch(`/api/orders/userorder/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
                console.log(response);
            })
            .then(data => {
                console.log(data);
                updateOrderTable(data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    } else {
        console.error('Error decoding JWT token.');

    }
});

function updateOrderTable(data) {
    const userContainer = document.getElementById('order-container');

    if (data.length > 0) {
        const ordersHtml = data.map(order => {
            const orderProductsHtml = order.orderProducts.map(product => `
                <p>Product Name: ${product.productName}</p>
                <p>Quantity: ${product.quantity}</p>
            `).join('');

            return `
                <div>
                    <p>Order ID: ${order.orderId}</p>
                    <p>Order Date: ${order.orderDate}</p>
                    <div>${orderProductsHtml}</div>
                    <hr>
                </div>
            `;
        }).join('');

        userContainer.innerHTML = `
            <h2>Orders Details</h2>
            ${ordersHtml}
        `;
    } else {
        userContainer.innerHTML = `
            <h2>No Orders Found</h2>
        `;
    }
}





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


let currentUserId;
function updateUsersTable(data) {
    const userContainer = document.getElementById('user-container');
    userContainer.innerHTML = `
                    <h2>User Details</h2>
                    <p>Email: ${data.email}</p>
                    <p>First Name: ${data.firstName}</p>
                    <p>Last Name: ${data.lastName}</p>
                    <button class="admin_button" onclick="editModalUser(${data.id})">Edit</button>
                `;
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

  

        fetch(`../../api/user/edit/${currentUserId}/${encodeURIComponent(editedUser.Email)}/${editedUser.FirstName}/${editedUser.LastName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
        })
            .then(response => {
                closeeditModalUser()
                const decodedToken = parseJwt(jwtToken);
                if (decodedToken) {
                    const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

                    fetch(`/api/user/getbyid/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}`,
                        },
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }

                            return response.json();
                        })
                        .then(data => {
                            console.log(data);
                            updateUsersTable(data);
                        })
                        .catch(error => {
                            console.error('Error fetching user data:', error);
                        });
                } else {
                    console.error('Error decoding JWT token.');

                }
            })
        

    }


function closeeditModalUser() {
    document.getElementById('userModalEdit').style.display = 'none';
}