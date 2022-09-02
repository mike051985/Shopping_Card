// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
const cartSection = document.querySelector('#cart-section');
const checkoutSection = document.querySelector('#checkout-section');
const amountToBePaid = document.querySelector('.Amount-to-be-paid');
const errorElement = document.querySelector('#error');
const checkoutForm = document.getElementById('form');
const fullNameEl = document.getElementById('fullName');
const phoneNumberEl = document.getElementById('phone');
const emailEl = document.getElementById('email');
const addressEl = document.getElementById('address');
const countryEl = document.getElementById('country');
const zipEl = document.getElementById('zip');
const cardNameEl = document.getElementById('cc-name');
const cardNumberEl = document.getElementById('cc-number');
const cardExpEl = document.getElementById('cc-expiration');
const cardSecEl = document.getElementById('cc-cvv');
const purchaseMessage = document.querySelector('#purchase');
const checkout = document.querySelector('#checkout');


// cart items
let cart = [];
// buttons
let buttonsDOM = [];

// getting the products
class Products {
    async getProducts(){
        try {
            let result = await fetch('fruits.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image};
            });
            return products;
        } catch (error) {
        }
    }
}

// display products
class UI {
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result +=`
                <article class="product">
                    <div class="img-container">
                        <img
                            src=${product.image}
                            alt="product"
                            class="product-img"
                        />
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart"></i>
                            add to bag
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                </article> 
            `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            }  
            button.addEventListener('click',(event)=>{
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount: 1 };
                // add product to the cart
                cart = [...cart, cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
            });
            
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        amountToBePaid.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src=${item.image} alt="product" />
            <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">
                    ${item.amount}
                </p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `;
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
    }
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart(){
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }
    cartLogic(){
        // clear cart button
        clearCartBtn.addEventListener("click", ()=>{
            this.clearCart();
        });
        // cart functionality
        cartContent.addEventListener("click", event =>{
            if (event.target.classList.contains("remove-item")) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();

    // setup app
    ui.setupAPP();

    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=> {
        ui.getBagButtons();
        ui.cartLogic();
    });
});

// hide checkout
document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    checkoutSection.classList.add('form-hidden');
});

// switch between cart and checkout
document.querySelector('.checkout').addEventListener('click', (e) => {
    e.preventDefault();
    // prevent checkout to open if cart is empty
    let errorMessage = [];
    if (cartContent.children.length === 0) {
        errorMessage.push('Before checkout, please add products to the cart. Thank you..!');
        errorElement.innerText = errorMessage;
        return false;
    }
    else {
        cartSection.classList.add('form-hidden');
        checkoutSection.classList.remove('form-hidden');
        errorMessage.push('');
        errorElement.innerText = errorMessage;
    }
    
});

document.querySelector('.return-to-cart').addEventListener('click', (e) => {
    e.preventDefault();
    checkoutSection.classList.add('form-hidden');
    cartSection.classList.remove('form-hidden');
});

// checkout form validation
// Billing address
const checkFullName = () => {
    let valid = false;

    const fullName = fullNameEl.value.trim();

    if (!isRequired(fullName)) {
        showError(fullNameEl, 'Full Name cannot be blank');
    }
    else {
        showSuccess(fullNameEl);
        valid = true;
    }
    return valid;
};

const checkPhoneNumber = () => {
    let valid = false;

    const phoneNumber = phoneNumberEl.value.trim();

    if (!isRequired(phoneNumber)) {
        showError(phoneNumberEl, 'Phone number cannot be blank');
    }
    else if (!isPhoneNumberValid(phoneNumber)) {
        showError(phoneNumberEl, 'Phone number is not valid.')
    } 
    else {
        showSuccess(phoneNumberEl);
        valid = true;
    }
    return valid;
};

const checkEmail = () => {
    let valid = false;

    const email = emailEl.value.trim();

    if (!isRequired(email)) {
        showError(emailEl, 'Email cannot be blank.');
    } 
    else if (!isEmailValid(email)) {
        showError(emailEl, 'Email is not valid.')
    } 
    else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
};

const checkAddress = () => {
    let valid = false;

    const address = addressEl.value.trim();

    if (!isRequired(address)) {
        showError(addressEl, 'Please enter your shipping address');
    }
    else {
        showSuccess(addressEl);
        valid = true;
    }
    return valid;
};

const checkCountry = () => {
    let valid = false;

    const country = countryEl.value.trim();

    if (!isRequired(country)) {
        showError(countryEl, 'Please enter your country.');
    }
    else {
        showSuccess(countryEl);
        valid = true;
    }
    return valid;
};

const checkZip = () => {
    let valid = false;

    const zip = zipEl.value.trim();

    if (!isRequired(zip)) {
        showError(zipEl);
    }
    else {
        showSuccess(zipEl);
        valid = true;
    }
    return valid;
};

// Payment info 
const checkCardName = () => {
    let valid = false;

    const cardName = cardNameEl.value.trim();

    if (!isRequired(cardName)) {
        showError(cardNameEl, 'Card name is required');
    }
    else {
        showSuccess(cardNameEl);
        valid = true;
    }
    return valid;
};

const checkcardExp = () => {
    let valid = false;

    const cardExp = cardExpEl.value.trim();

    if (!isRequired(cardExp)) {
        showError(cardExpEl);
    }
    else {
        showSuccess(cardExpEl);
        valid = true;
    }
    return valid;
};

const checkCardSec = () => {
    let valid = false;

    const cardSec = cardSecEl.value.trim();

    if (!isRequired(cardSec)) {
        showError(cardSecEl);
    }
    else {
        showSuccess(cardSecEl);
        valid = true;
    }
    return valid;
};

const checkCardNumber = () => {
    let valid = false;

    const card = cardNumberEl.value.trim();
    

    if (!isRequired(card)) {
        showError(cardNumberEl, 'Card number cannot be blank');
    }
    else if (!isCardValid(card)) {
        showError(cardNumberEl, 'Sorry, we only accept Visa or Master Card.')
    } 
    else {
        showSuccess(cardNumberEl);
        valid = true;
    }
    return valid;
};


const isCardValid = (card) => {
    const re = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/;
    return re.test(card);
};

const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const isPhoneNumberValid = (phoneNumber) => {
    const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    return re.test(phoneNumber);
};

const isRequired = value => value === '' ? false : true;

const showError = (input, message) => {
    // get the form-field element
    const formField = input.parentElement;
    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');

    // show the error message
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    // get the form-field element
    const formField = input.parentElement;

    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');

    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
}


checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // validate fields
    let isFullNameValid = checkFullName(),
        isPhoneNumberValid = checkPhoneNumber(),
        isEmailValid = checkEmail(),
        isAddressValid = checkAddress(),
        isCountryValid = checkCountry(),
        isZipValid = checkZip(),
        isCardNameValid = checkCardName(),
        isCardNumberValid = checkCardNumber();
        isCardSecValid = checkCardSec(),
        isCardExpValid = checkcardExp();


    let isCheckoutFormValid = isFullNameValid && 
        isPhoneNumberValid && 
        isAddressValid &&
        isCountryValid &&
        isZipValid &&
        isEmailValid &&
        isCardNameValid && 
        isCardNumberValid &&
        isCardSecValid &&
        isCardExpValid;

    let messages = [];

    if (isCheckoutFormValid) {
        messages.push('Thank you for your purchase.');
        purchaseMessage.innerText = messages;
        checkout.classList.add('form-hidden'); 
    }

    document.addEventListener("DOMContentLoaded", (e) => {
        e.preventDefault();
        checkout.classList.remove('form-hidden');
    });
});