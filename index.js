let container = document.querySelector(".products-cont");
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

updateFavoritesCount();

fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        data.products.forEach(product => {
            let div = document.createElement('div');
            div.className = "product col-12 col-md-4 col-lg-3";

            let isInCart = cart.some(item => item.id == product.id);
            let isInFavorites = favorites.some(item => item.id == product.id);

            let cartona = `
                <div class="card mb-3" style="max-height: 350px; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                    <div class="product-image-wrapper position-relative">
                        <img src="${product.thumbnail}" alt="" class="img-card-top" height="150" width="100%" style="object-fit: contain;">
                        <i class="fas fa-heart position-absolute top-0 end-0 p-2 ${isInFavorites ? 'text-danger' : 'text-muted'} favorite-icon" style="font-size: 24px; cursor: pointer;" data-id="${product.id}"></i>
                    </div>
                    <div class="card-body">
                        <div>
                            <h5 class="card-title">${(product.title.length > 15 ? product.title.substring(0, 15) + "..." : product.title)}</h5>
                            <p class="card-price m-0"><span class="fs-4 text-primary">$${product.price}</span>/piece</p>
                            <p class="text-muted">shopping via eraasoft</p>
                        </div>
                        ${isInCart ? '<h5 class="card-title text-center pb-1">Added to cart!</h5>' :
                            `<button class="btn btn-primary w-100 add-to-cart" data-target="${product.id}">Add to cart</button>`}
                    </div>
                </div>
            `;
            div.innerHTML = cartona;
            container.appendChild(div);
        });

        addToCart(data);
        handleFavorites(data);
    });


function addToCart(data) {
    let addToCartBtns = document.querySelectorAll(".add-to-cart");

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.target;
            const product = data.products.find(product => product.id == id);

            if (!cart.some(item => item.id == id)) {
                cart.push(product);
                saveCart();
                btn.innerText = "Added to cart";
                btn.remove();
                const parent = btn.closest(".card");
                parent.innerHTML += '<h5 class="card-title text-center pb-1">Added to cart!</h5>';
            }
        });
    });
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


function handleFavorites(data) {
    let favoriteIcons = document.querySelectorAll(".favorite-icon");

    favoriteIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const id = icon.dataset.id;

        
            const product = data.products.find(product => product.id == id);

            if (favorites.some(item => item.id == id)) {
           
                const index = favorites.findIndex(item => item.id == id);
                favorites.splice(index, 1);
                icon.classList.remove('text-danger');
                icon.classList.add('text-muted');
            } else {
               
                favorites.push(product);
                icon.classList.remove('text-muted');
                icon.classList.add('text-danger');
            }

       
            saveFavorites();
            updateFavoritesCount();
        });
    });
}


function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}


function updateFavoritesCount() {
    const favoritesCount = document.getElementById("favorites-count");
    favoritesCount.innerText = favorites.length;
}
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    cartCount.innerText = cart.length;
}
updateCartCount();