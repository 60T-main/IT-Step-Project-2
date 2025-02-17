let baseUrl = `https://restaurant.stepprojects.ge`;
let productsArr = [];
let categoriesArr = [];

let cardsDiv = document.querySelector(`.cardsDiv`);
let categoriesDiv = document.querySelector(`.categoriesDiv`);
let vegCheckbox = document.querySelector('.filterVeg');
let nutsCheckbox = document.querySelector('.filterNuts');

// fetch products
function getProductsAll() {
    fetch(`${baseUrl}/api/products/GetAll`)
    .then(res => res.json())
    .then(data => {
        productsArr = data;
        generateCardsVisual();
    })
    .catch(error => console.error("Error fetching Products:", error));
}

// fetch categories
function getCategoriesAll() {
    fetch(`${baseUrl}/api/Categories/GetAll`)
    .then(res => res.json())
    .then(data => {
        categoriesArr = data;
        generateCategoryVisual();
    })
    .catch(error => console.error("Error fetching Categories:", error));
}

function filterByCategory(categoryId) {
    if (!categoryId || categoryId === "0") {
        getProductsAll();
        return;
    }

    fetch(`${baseUrl}/api/Categories/GetCategory/${categoryId}`)
    .then(res => res.json())
    .then(data => {
        productsArr = data.products;
        generateCardsVisual();
    })
    .catch(error => console.error("Error fetching Products:", error));
}

// generate product cards
function generateCardsVisual() {
    cardsDiv.innerHTML = productsArr.map(product => `
        <div class="card border">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="spiceDiv"><p>Spiciness: ${product.spiciness}</p></div>
            <div class="nutsVegDiv">
                <p>${product.nuts ? '✔️ Nuts' : '❌ Nuts'}</p>
                <p>${product.vegeterian ? '✔️ Vegetarian' : '❌ Vegetarian'}</p>
            </div>
            <div class="priceCartDiv">
                <h3>${product.price} GEL</h3>
                <a>Add to Cart</a>
            </div>
        </div>
    `).join('');
}

// generate categories
function generateCategoryVisual() {
    categoriesDiv.innerHTML = `
        <a class="category" data-id="0" style="cursor:pointer">All</a>
        ${categoriesArr.map(category => `<a class="category" data-id="${category.id}" style="cursor:pointer">${category.name}</a>`).join('')}
    `;

    // Add event listeners
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', () => {
            filterByCategory(category.getAttribute('data-id'));
        });
    });
}



// Initial fetch
getProductsAll();
getCategoriesAll();
