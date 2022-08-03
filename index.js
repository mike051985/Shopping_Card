
const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');

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
};

// Show/Hide cart container
document.getElementById('cart-btn').addEventListener('click', () => {
    cartContainer.classList.toggle('show-cart-container');
});

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