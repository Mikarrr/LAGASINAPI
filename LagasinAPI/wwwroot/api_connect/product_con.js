let jwtToken = localStorage.getItem('jwtToken');
document.addEventListener('DOMContentLoaded', function () {
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
  
    if (productId) {
        fetchProductDetails(productId);
    } else {
        console.error('Product ID is missing in the URL.');
    }
});


function fetchProductDetails(productId) {
   
    fetch(`../../api/products/view(id)?id=${productId}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => {
            return response.json();
        })
        .then(product => {
            renderProductDetails(product);
        })
}


function renderProductDetails(product) {
    const productDetailsContainer = document.getElementById('productDetailsContainer');

  
    productDetailsContainer.innerHTML = `
        <div class="product_img">
            <img src="${product.imageUrl}" alt="${product.name}" />
        </div>
        <div class="product_description">
      
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>${product.price} PLN</p>
            <div class="product_select">
            <label for="size">Size:</label>
            <select id="size" name="size">
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
            </select>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" value="1" min="1">
            <button class="submit_label" onclick="addToCart(${product.id})">Add to Cart</button>
            <div id="success_message"></div>
            </div>
        </div>
    `;
}

function addToCart(productId) {
    const size = document.getElementById('size').value;
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value, 10);


    if (isNaN(quantity) || quantity <= 0) {
        alert('Proszê wprowadziæ prawid³ow¹ iloœæ produktu.');
        return;
    }

    fetch(`../../api/products/addtocart/${productId}?size=${size}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => {

            const successMessage = document.createElement('div');
            successMessage.innerHTML = 'Product added to cart!';
            successMessage.style.color = 'white';
            successMessage.style.fontSize = '14px';
            successMessage.style.fontFamily = 'Montserrat';
            document.getElementById('success_message').appendChild(successMessage);
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 2000);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
          
        })
}

