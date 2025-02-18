let baseUrl = `https://restaurant.stepprojects.ge`;
let productsArr = [];
let cardsDiv = document.querySelector(`.cardsDiv`);


getProductsAll();

// Fetch products for basket
function getProductsAll() {
    fetch(`${baseUrl}/api/Baskets/GetAll`)
        .then(res => res.json())
        .then(data => {
            productsArr = data;
            generateCardsVisual();
        })
        .catch(error => console.error("Error fetching Products:", error));
}


// Generate product cards
function generateCardsVisual() {
    cardsDiv.innerHTML = productsArr.map(product => `
        <div class="card border">
            <img src="${product.product.image}" alt="${product.product.name}">
            <h3>${product.product.name}</h3>
            <div class="spiceDiv"><p>Spiciness: ${product.product.spiciness}</p></div>
            <div class="nutsVegDiv">
                <p>${product.product.nuts ? '✔️ Nuts' : '❌ Nuts'}</p>
                <p>${product.product.vegeterian ? '✔️ Vegetarian' : '❌ Vegetarian'}</p>
            </div>
            <div class="priceCartDiv">
            <h3>${product.product.price} GEL</h3>
            </div> 
            <div class="priceCartDiv">
            <button style="width: 2rem">-</button>
            <h3>Qty: ${product.quantity}</h3>
            <button style="width: 2rem">+</button>
            </div> 
        <a onclick="onDeleteProductBtnClick(${product.product.id})" class="deleteBtn">Delete</a>
    `).join('');
}


function onDeleteProductBtnClick(id){
    fetch(`${baseUrl}/api/Baskets/DeleteProduct/${id}`,{
        method:`DELETE`,
        headers: {'Content-Type': 'application/json'},
    }).then(res => {
        return res.json();
    }).then((data) => {
        getProductsAll();
    })
    .catch(error => console.error("Error fetching Products:", error));
}
