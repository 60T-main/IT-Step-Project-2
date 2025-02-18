let baseUrl = `https://restaurant.stepprojects.ge`;
let productsArr = [];
let categoriesArr = [];
let selectedCategory = null; // Store selected category

let cardsDiv = document.querySelector(`.cardsDiv`);
let categoriesDiv = document.querySelector(`.categoriesDiv`);
let vegCheckbox = document.querySelector('.filterVeg');
let nutsCheckbox = document.querySelector('.filterNuts');
let spiceSlider = document.querySelector('.slider');
let spiceTxt = document.querySelector(`.spiceTxt`);

spiceTxt.innerHTML = `Spiciness: 0`
spiceSlider.addEventListener('input', () => {
    spiceTxt.innerHTML = `Spiciness: ${spiceSlider.value}`;
});


// Fetch products
function getProductsAll() {
    fetch(`${baseUrl}/api/products/GetAll`)
        .then(res => res.json())
        .then(data => {
            productsArr = data;
            generateCardsVisual();
        })
        .catch(error => console.error("Error fetching Products:", error));
}

// Fetch categories
function getCategoriesAll() {
    fetch(`${baseUrl}/api/Categories/GetAll`)
        .then(res => res.json())
        .then(data => {
            categoriesArr = data;
            generateCategoryVisual();
        })
        .catch(error => console.error("Error fetching Categories:", error));
}

// Filter by categories
function filterByCategory(categoryId) {
    selectedCategory = categoryId; // Store selected category

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

// Generate product cards
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
                <a class="addToBasketBtn" onclick="onAddToBasketBtnClick(${product.id})">Add to Cart</a>
            </div>
        </div>
    `).join('');
}

// Generate categories
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

// Filter by nuts, vegetarian, spice, and category
function onFilterBtnClick() {
    let queryArray = [];
    let vegChecked = vegCheckbox.checked;
    let nutsChecked = !nutsCheckbox.checked; // Invert value as per your logic

    if (vegChecked) {
        queryArray.push(`vegeterian=true`);
    }
    if (!nutsChecked) {
        queryArray.push(`nuts=false`);
    }
    if (spiceSlider.value != 0) {
        queryArray.push(`spiciness=${spiceSlider.value}`);
    }
    if (selectedCategory && selectedCategory !== "0") { 
        queryArray.push(`categoryId=${selectedCategory}`);
    }

    let query = queryArray.length > 0 ? `?${queryArray.join("&")}` : '';

    fetch(`${baseUrl}/api/products/GetFiltered${query}`)
        .then(res => res.json())
        .then(data => {
            productsArr = data;
            generateCardsVisual();
        })
        .catch(error => console.error("Error fetching Products:", error));
}

// reset button
function resetBtnClick(){
    getProductsAll();

    spiceSlider.value = 0; 
    vegCheckbox.checked = false;
    nutsCheckbox.checked = false;
    spiceTxt.innerHTML = `Spiciness: 0`;
}


function onAddToBasketBtnClick(id) {
    console.log(id);

    let findElementInArray = productsArr.find((element)=>{
        return element.id == id
    })

    if(findElementInArray){

        let data = {
            quantity: 1,
            price: findElementInArray.price,
            productId: findElementInArray.id,
        }
    
        fetch(`${baseUrl}/api/Baskets/AddToBasket`,{
            method:`POST`,
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(data)
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            console.log(`add in basket`);
        })
        .catch((err) =>{
            console.error(err);
            console.error(`error add to basket`);
        })
    } else {
        console.error(`element not found`); 
    }
}



getProductsAll();
getCategoriesAll();
