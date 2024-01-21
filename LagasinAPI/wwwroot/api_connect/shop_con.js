let jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {  
    fetchProducts();
});

function fetchProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
   

    fetch(`../../api/products/view(category)?category=${category}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    })
        .then(response => response.json())
        .then(products => {
            renderProducts(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function renderProducts(products) {
    const productsContainer = document.getElementById('productsContainer');

    productsContainer.innerHTML = '';

    const szerokoscProduktu = 24;
    productsContainer.style.width = `${products.length * szerokoscProduktu + 1}vw`;

  
    const currentPageUrl = window.location.href;

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

    
        const relativePath =
            currentPageUrl.includes('/pages/pages_admin/') ? './admin_product.html' :
                currentPageUrl.includes('/pages/pages_user/') ? './user_product.html' :
                    './product.html';


        productElement.innerHTML = `
            <a href="${relativePath}?id=${product.id}">
                <div class="product_img" style="background-image: url('${product.imageUrl}');"></div>
                <div class="product_description">
                    <h2>${product.name}</h2>
                    <p>${product.price} PLN</p>
                </div>
            </a>
        `;

        productsContainer.appendChild(productElement);
    });

    initGSAPAnimations();
}


function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    const MainProjects = document.querySelector(".product_container");
    const divs = gsap.utils.toArray(".product_container .product");

    if (window.innerWidth >= 1150) {
        const totalProducts = divs.length;
        const scrollDistance = totalProducts * 240


        let scrollTwin = gsap.to(divs, {
            xPercent: -100 * (totalProducts - 4),
            ease: "none",
            scrollTrigger: {
                trigger: MainProjects,
                pin: true,
                scrub: 1,
                end: `+=${scrollDistance}`,
            },
        });

        divs.forEach((div, index) => {
            if (index !== 0 && window.innerWidth >= 1150) {
                let items = div.querySelectorAll(".anim");

                items.forEach((item) => {
                    gsap.from(item, {
                        y: -130,
                        opacity: 0,
                        stagger: 0.5,
                        duration: 1,
                        ease: "power1",

                        scrollTrigger: {
                            trigger: div,
                            containerAnimation: scrollTwin,
                            start: "left center",
                            markers: false,
                        },
                    });
                });
            }
        });
    }
}
