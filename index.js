
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
                        <i class="fas fa-shopping-cart"></i>Add To Cart
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
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

// Get Product info after add to cart 
function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        price: product.querySelector('.product-price').textContent
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

// Add the selected product to the cart list
function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
    <div class="cart-item">
        <img src="${product.imgSrc}" alt="product image">
            <div class="cart-item-info">
            <h3 class="cart-item-name">${product.name}</h3>
            <span class="cart-item-price">${product.price}</span>
        </div>
    </div>
    <button class="cart-item-del-btn">
        <i class="fas fa-times"></i>
    </button>
    `;
    cartList.appendChild(cartItem);
}

// Save the product in the local storage
function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
}

// Get all the products info if there is any in the local storage
function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // Return empty array if there isn't any product info
}
