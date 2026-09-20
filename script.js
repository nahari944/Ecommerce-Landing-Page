
/* =========================================================
   PRODUCTS DATA
========================================================= */

const products = [
    {
        id: 1,
        name: "Phone Holder Sakti",
        price: 29.90,
        category: "Phone",
        rating: 5.0,
        reviews: "1.2k",
        image: "./assets/phone-holder-sakti.png"
    },
    {
        id: 2,
        name: "Headsound",
        price: 12.00,
        category: "Music",
        rating: 5.0,
        reviews: "1.2k",
        image: "./assets/headsound.png"
    },
    {
        id: 3,
        name: "Adudu Cleaner",
        price: 29.90,
        category: "Other",
        rating: 4.4,
        reviews: "1k",
        image: "./assets/adudu-cleaner.png"
    },
    {
        id: 4,
        name: "CCTV Maling",
        price: 50.00,
        category: "Home",
        rating: 4.8,
        reviews: "120",
        image: "./assets/cctv.png"
    },
    {
        id: 5,
        name: "Stuffus Peker 32",
        price: 9.90,
        category: "Other",
        rating: 5.0,
        reviews: "1.2k",
        image: "./assets/stuffus-peker-32.png"
    },
    {
        id: 6,
        name: "Stuffus R175",
        price: 34.10,
        category: "Music",
        rating: 4.8,
        reviews: "2.4k",
        image: "./assets/stuffus-r175.png"
    },
    {
        id: 7,
        name: "TWS Bujug",
        price: 29.90,
        category: "Music",
        rating: 5.0,
        reviews: "1.2k",
        image: "./assets/tws-bujug.png"
    },
    {
        id: 8,
        name: "Headsound Baptis",
        price: 12.00,
        category: "Music",
        rating: 5.0,
        reviews: "1.2k",
        image: "./assets/headsound-baptis.png"
    },
    {
        id: 9,
        name: "Adudu Cleaner Pro",
        price: 29.90,
        category: "Other",
        rating: 4.4,
        reviews: "1k",
        image: "./assets/adudu-cleaner-pro.png"
    }
];


/* =========================================================
   STATE
========================================================= */

let currentCategory = "All";
let currentSearch = "";
let currentPage = 1;
let sortType = "default";

const productsPerPage = 6;

let cart = JSON.parse(localStorage.getItem("stuffsus_cart")) || [];


/* =========================================================
   DOM
========================================================= */

const productsGrid = document.getElementById("productsGrid");
const recommendationsGrid = document.getElementById("recommendationsGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const headerSearchButton = document.getElementById("headerSearchButton");
const sortSelect = document.getElementById("sortSelect");
const pagination = document.getElementById("pagination");
const emptyState = document.getElementById("emptyState");
const resultsText = document.getElementById("resultsText");
const productCount = document.getElementById("productCount");

const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartItemsText = document.getElementById("cartItemsText");
const checkoutButton = document.getElementById("checkoutButton");

const toast = document.getElementById("toast");


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}


function saveCart() {
    localStorage.setItem(
        "stuffsus_cart",
        JSON.stringify(cart)
    );
}


function showToast(message) {
    toast.textContent = message;

    toast.classList.remove("opacity-0");

    setTimeout(() => {
        toast.classList.add("opacity-0");
    }, 1800);
}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function getFilteredProducts() {

    let result = [...products];

    if (currentCategory !== "All") {
        result = result.filter(
            product => product.category === currentCategory
        );
    }

    if (currentSearch.trim()) {

        const search = currentSearch
            .toLowerCase()
            .trim();

        result = result.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );
    }

    if (sortType === "low") {
        result.sort((a, b) => a.price - b.price);
    }

    if (sortType === "high") {
        result.sort((a, b) => b.price - a.price);
    }

    if (sortType === "rating") {
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function productCard(product) {

    return `
        <article class="product-card">

            <div class="bg-gray-100 rounded-3xl p-8 relative mb-4 h-60 flex items-center justify-center overflow-hidden">

                <span
                    class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm z-10"
                >
                    ${product.category}
                </span>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    class="product-image w-full h-full object-contain mix-blend-multiply"
                    onerror="this.style.display='none'"
                >

            </div>

            <div class="flex justify-between items-start gap-3 mb-1">

                <h3 class="font-bold">
                    ${product.name}
                </h3>

                <span class="font-bold whitespace-nowrap">
                    ${formatPrice(product.price)}
                </span>

            </div>

            <div class="flex items-center gap-1 text-[10px] text-gray-400 mb-4">

                <span class="text-orange-400">
                    <i class="fas fa-star"></i>
                    ${product.rating}
                </span>

                <span>
                    (${product.reviews} Reviews)
                </span>

            </div>

            <div class="flex gap-2">

                <button
                    type="button"
                    onclick="addToCart(${product.id})"
                    class="flex-1 text-[11px] font-bold py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition"
                >
                    Add to Cart
                </button>

                <button
                    type="button"
                    onclick="buyNow(${product.id})"
                    class="flex-1 text-[11px] font-bold py-2.5 rounded-full bg-gray-900 text-white hover:bg-black transition"
                >
                    Buy Now
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    const filtered = getFilteredProducts();

    productCount.textContent = filtered.length;

    resultsText.textContent =
        `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`;

    if (!filtered.length) {

        productsGrid.innerHTML = "";
        pagination.innerHTML = "";
        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");

    const totalPages =
        Math.ceil(filtered.length / productsPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start =
        (currentPage - 1) * productsPerPage;

    const visibleProducts =
        filtered.slice(
            start,
            start + productsPerPage
        );

    productsGrid.innerHTML =
        visibleProducts
            .map(productCard)
            .join("");

    renderPagination(totalPages);
}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination(totalPages) {

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = `
        <button
            type="button"
            onclick="changePage(${currentPage - 1})"
            class="text-xs font-bold flex items-center gap-2 ${
                currentPage === 1
                    ? "text-gray-300 pointer-events-none"
                    : "text-gray-500 hover:text-black"
            }"
        >
            <i class="fas fa-arrow-left"></i>
            Previous
        </button>

        <div class="flex gap-2">
    `;

    for (let i = 1; i <= totalPages; i++) {

        html += `
            <button
                type="button"
                onclick="changePage(${i})"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === currentPage
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }"
            >
                ${i}
            </button>
        `;
    }

    html += `
        </div>

        <button
            type="button"
            onclick="changePage(${currentPage + 1})"
            class="text-xs font-bold flex items-center gap-2 ${
                currentPage === totalPages
                    ? "text-gray-300 pointer-events-none"
                    : "text-gray-500 hover:text-black"
            }"
        >
            Next
            <i class="fas fa-arrow-right"></i>
        </button>
    `;

    pagination.innerHTML = html;
}


function changePage(page) {

    const totalPages =
        Math.ceil(
            getFilteredProducts().length /
            productsPerPage
        );

    if (page < 1 || page > totalPages) {
        return;
    }

    currentPage = page;

    renderProducts();

    document
        .getElementById("shop")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}


/* =========================================================
   CATEGORY
========================================================= */

document.querySelectorAll(".category-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category-button")
                .forEach(btn => {

                    btn.classList.remove(
                        "bg-red-50",
                        "text-red-500"
                    );

                    btn.classList.add(
                        "text-gray-500"
                    );
                });

            button.classList.remove(
                "text-gray-500"
            );

            button.classList.add(
                "bg-red-50",
                "text-red-500"
            );

            currentCategory =
                button.dataset.category;

            currentPage = 1;

            renderProducts();
        });
    });


/* =========================================================
   SEARCH
========================================================= */

function performSearch() {

    currentSearch = searchInput.value;

    currentPage = 1;

    renderProducts();

    document
        .getElementById("shop")
        .scrollIntoView({
            behavior: "smooth"
        });
}


searchButton.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            performSearch();
        }
    }
);


headerSearchButton.addEventListener(
    "click",
    () => {

        searchInput.focus();

        window.scrollTo({
            top: 300,
            behavior: "smooth"
        });
    }
);


/* =========================================================
   SORT
========================================================= */

sortSelect.addEventListener(
    "change",
    event => {

        sortType = event.target.value;

        currentPage = 1;

        renderProducts();
    }
);


/* =========================================================
   CART
========================================================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) return;

    const existing =
        cart.find(
            item => item.id === productId
        );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();

    updateCart();

    showToast(
        `${product.name} added to cart`
    );
}


function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    saveCart();

    updateCart();
}


function changeQuantity(productId, change) {

    const item =
        cart.find(
            product => product.id === productId
        );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();

    updateCart();
}


function updateCart() {

    const totalItems =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    const totalPrice =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

    cartCount.textContent = totalItems;

    cartItemsText.textContent =
        `${totalItems} item${totalItems !== 1 ? "s" : ""}`;

    cartTotal.textContent =
        formatPrice(totalPrice);

    if (!cart.length) {

        cartItems.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center">

                <i class="fas fa-shopping-cart text-4xl text-gray-200 mb-4"></i>

                <h3 class="font-bold text-lg">
                    Your cart is empty
                </h3>

                <p class="text-sm text-gray-400 mt-2">
                    Add some products to your cart.
                </p>

            </div>
        `;

        return;
    }

    cartItems.innerHTML =
        cart.map(item => `
            <div class="flex gap-4 border-b pb-4">

                <div class="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        class="w-full h-full object-contain mix-blend-multiply"
                    >

                </div>

                <div class="flex-1">

                    <div class="flex justify-between gap-3">

                        <h4 class="font-bold text-sm">
                            ${item.name}
                        </h4>

                        <button
                            type="button"
                            onclick="removeFromCart(${item.id})"
                            class="text-gray-400 hover:text-red-500"
                        >
                            <i class="fas fa-trash"></i>
                        </button>

                    </div>

                    <p class="text-sm font-bold mt-1">
                        ${formatPrice(item.price)}
                    </p>

                    <div class="flex items-center gap-3 mt-3">

                        <button
                            type="button"
                            onclick="changeQuantity(${item.id}, -1)"
                            class="w-7 h-7 rounded-full bg-gray-100"
                        >
                            -
                        </button>

                        <span class="text-sm font-bold">
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            onclick="changeQuantity(${item.id}, 1)"
                            class="w-7 h-7 rounded-full bg-gray-100"
                        >
                            +
                        </button>

                    </div>

                </div>

            </div>
        `).join("");
}


/* =========================================================
   CART DRAWER
========================================================= */

function openCart() {

    cartDrawer.classList.remove(
        "translate-x-full"
    );

    cartOverlay.classList.remove(
        "hidden"
    );

    setTimeout(() => {
        cartOverlay.classList.remove(
            "opacity-0"
        );
    }, 10);
}


function closeCartDrawer() {

    cartDrawer.classList.add(
        "translate-x-full"
    );

    cartOverlay.classList.add(
        "opacity-0"
    );

    setTimeout(() => {

        cartOverlay.classList.add(
            "hidden"
        );

    }, 300);
}


cartButton.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartDrawer
);


cartOverlay.addEventListener(
    "click",
    closeCartDrawer
);


/* =========================================================
   BUY NOW
========================================================= */

function buyNow(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) return;

    addToCart(productId);

    openCart();
}


/* =========================================================
   RECOMMENDATIONS
========================================================= */

function renderRecommendations() {

    const recommended =
        products.slice(6, 9);

    recommendationsGrid.innerHTML =
        recommended
            .map(productCard)
            .join("");
}


/* =========================================================
   NEWSLETTER
========================================================= */

document
    .getElementById("newsletterForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const email =
                document.getElementById(
                    "emailInput"
                ).value.trim();

            if (!email) return;

            showToast(
                "Thanks for subscribing!"
            );

            event.target.reset();
        }
    );


/* =========================================================
   CHECKOUT
========================================================= */

checkoutButton.addEventListener(
    "click",
    () => {

        if (!cart.length) {
            showToast(
                "Your cart is empty"
            );

            return;
        }

        showToast(
            "Checkout is ready!"
        );
    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeCartDrawer();
        }
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

renderProducts();
renderRecommendations();
updateCart();
