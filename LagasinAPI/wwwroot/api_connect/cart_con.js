let jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {
    fetchCart();
});

function fetchCart() {
    fetch('../../api/products/cart', {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => {
            return response.json();
        })
        .then(cart => {
            renderCart(cart);
        });
}


function mapSizeEnumToString(size) {
    switch (size) {
        case 0:
            return 'S';
        case 1:
            return 'M';
        case 2:
            return 'L';
        case 3:
            return 'XL';
        default:
            return 'Unknown Size';
    }
}

function calculateCartTotal(products) {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
}


function renderCart(cart) {
    const cartSummaryContainer = document.getElementById('cart-summary');
    const cartTotalContainer = document.getElementById('cart-total');
 
    if (cart && cart.products && Array.isArray(cart.products) && cart.products.length > 0) {
        
        cartSummaryContainer.innerHTML = '';
        cart.products.forEach(product => {
           
            const sizeString = mapSizeEnumToString(product.size);

            cartSummaryContainer.innerHTML += `
               
                <div class="cart-item">
                    <p>${product.name} </p>
                    <p>Quantity: ${product.quantity}</p>
                    <p>${sizeString}</p>
                    <p>${product.price * product.quantity}</P>
                    <button onclick="editCartItem(${product.id})">Edit</button>
                    <button onclick="removeCartItem(${product.id})">Delete</button>
                </div>
            `;
        });
    } else {   
        cartSummaryContainer.innerHTML = '<p>Cart is empty</p>';
    }
    const total = calculateCartTotal(cart.products);
    cartTotalContainer.innerHTML = `<p class="total">Summary: ${total} PLN</p>`;
}



function editCartItem(productId) {
    const newQuantity = prompt('New Quantity:');

    if (newQuantity !== null && !isNaN(newQuantity)) {
        fetch(`../../api/products/editcart/${productId}/${newQuantity}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
        })
        .then(response => {
            fetchCart();            
        })
    }
}


function removeCartItem(productId) {
   fetch(`../../api/products/removefromcart/${productId}`, {
       method: 'DELETE',
       headers: {
           Authorization: `Bearer ${jwtToken}`
       },
   })
   .then(response => {
       fetchCart();
   })
        
}
   

function placeOrder() {
    if (!jwtToken) {
        const loginMessage = document.createElement('div');
        loginMessage.innerHTML = 'Log in to place an order!';
        loginMessage.style.color = 'white';
        loginMessage.style.fontSize = '14px';
        loginMessage.style.fontFamily = 'Montserrat';
        document.getElementById('login_message').appendChild(loginMessage);
        setTimeout(() => {
            loginMessage.style.display = 'none';
        }, 4000);
        return;
    }


    fetch('../../api/products/cart', {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => response.json())
        .then(cart => {
            if (cart && cart.products && cart.products.length > 0) {
             
                fetch('../../api/orders/place', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`
                    },
                })
                    .then(response => {
                        fetchCart();
                        const successMessage = document.createElement('div');
                        successMessage.innerHTML = 'The order has been successfully placed!';
                        successMessage.style.color = 'white';
                        successMessage.style.fontSize = '14px';
                        successMessage.style.fontFamily = 'Montserrat';
                        document.getElementById('success_message').appendChild(successMessage);
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 4000);
                    })
                    .catch(error => {
                        console.error('B³¹d podczas sk³adania zamówienia:', error);
                        const errorMessage = document.createElement('div');
                        errorMessage.innerHTML = 'An error occurred while placing your order. Try again.';
                        errorMessage.style.color = 'white';
                        errorMessage.style.fontSize = '14px';
                        errorMessage.style.fontFamily = 'Montserrat';
                        document.getElementById('error_message').appendChild(errorMessage);
                        setTimeout(() => {
                            errorMessage.style.display = 'none';
                        }, 4000);
                    });
            } else {
             
                const emptyCartMessage = document.createElement('div');
                emptyCartMessage.innerHTML = 'Attention! Add something to your cart before placing your order.';
                emptyCartMessage.style.color = 'white';
                emptyCartMessage.style.fontSize = '14px';
                emptyCartMessage.style.fontFamily = 'Montserrat';
                document.getElementById('empty_cart_message').appendChild(emptyCartMessage);
                setTimeout(() => {
                    emptyCartMessage.style.display = 'none';
                }, 4000);
            }
        })
        .catch(error => {
            console.error('B³¹d podczas pobierania koszyka:', error);
        });
}


