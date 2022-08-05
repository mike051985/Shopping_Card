
const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');

let cartItemID = 1;

eventListeners();

// All event listeners
function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
    })
    // Toggle navbar when toggle button is clicked
    document.querySelector('.navbar-toggler').
    addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.
        toggle('show-navbar');
    });

    // Show/Hide cart container
    document.getElementById('cart-btn').addEventListener('click', () => {
    cartContainer.classList.toggle('show-cart-container');
    });

    productList.addEventListener('click', purchaseProduct);
};


// Load product items content from JSON file
function loadJSON(){
    fetch(`fruits.json`)
    .then(response => response.json())
    .then(data  =>{
        let html = '';
        data.forEach(product => {
            html += `
                <div class="product-item">
                    <div class="product-img">
                        <img src="${product.imgSrc}" alt="mango">
                        <button class="add-to-cart-btn">
                        <i class="fas fa-shopping-cart">Add To Cart</i>
                        </button>
                    </div>
                    <div class="product-content">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">${product.price}</p>
                    </div>
                </div>
            `;
        });
        productList.innerHTML = html;
    })
    .catch(error => {
        alert(`User live server or local server`);
    })
}


// Purchase Product
function purchaseProduct(e){
    if (e.target.classList.contains('add-to-cart-btn')) {
        console.log(e.target);
    }
}
