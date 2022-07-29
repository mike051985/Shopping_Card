
const cartContainer = document.querySelector('.cart-container');

eventListeners();

// All event listeners
function eventListeners(){
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