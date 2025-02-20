let baseUrl = `https://restaurant.stepprojects.ge`;
let productsArr = [];
let cardsDivBasket = document.querySelector(`.cardsDivBasket`);


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
    empty = `<thead>
        <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
        </tr>
    </thead>`;

    empty += productsArr.map(product => `
    
        <tr>
            <td class="productTd">
                <a style="font-size: 16px; cursor:pointer; " onclick="onDeleteProductBtnClick(${product.product.id})">❌</a>
                <div class="imgP">
                <img src="${product.product.image}" alt="${product.product.name}">
                <p>${product.product.name}</p>
                </div>
            </td>
            <td>
            <div class="quantityDiv">
                <button onclick="onPlusOrMinusBtnClick(${product.product.id},1)">-</button>
                <h3>${product.quantity}</h3>
                <button onclick="onPlusOrMinusBtnClick(${product.product.id},0)">+</button>
                </div>
            </td>
            <td><h3>${product.product.price} GEL</h3></td>
            <td><h3>${product.price} GEL</h3></td>
        </tr>
        
    
        `).join('');

        let totalPriceArr = [];

        productsArr.forEach(product => {
            totalPriceArr.push(product.price)
        });

        let sum =  totalPriceArr.reduce((a, b) => a + b, 0);
        let sumDiv = document.querySelector('.sumDiv')

        sumDiv.innerHTML= `<h1 class="sumH1">Total: <span>${sum} Gel</span></h1></div>`;

    cardsDivBasket.innerHTML = empty;
}


function onDeleteProductBtnClick(id){
    fetch(`${baseUrl}/api/Baskets/DeleteProduct/${id}`,{
        method:`DELETE`,
        headers: {'Content-Type': 'application/json'},
    }).then((data) => {
        getProductsAll();
    })
    .catch(error => console.error("Error fetching Products:", error));
}

// plus and minus button function
function onPlusOrMinusBtnClick(id, isPlusOrMinus){
let findElement = productsArr.find((element)=>{
    return element.product.id == id
})

if(findElement){

    if (isPlusOrMinus == 0) {
        
        findElement.quantity = findElement.quantity + 1
    } else if(isPlusOrMinus == 1){
        if (findElement.quantity > 1) {
            findElement.quantity = findElement.quantity - 1
        }else{
            console.error(`isPlusMinus mist be 0 or 1`);
            return
        }
    }
    findElement.price = findElement.quantity * findElement.product.price
    console.log(findElement.quantity, findElement.price);
    
    let data = {
            quantity: findElement.quantity,
            price: findElement.price,
            productId: findElement.product.id
         }

         fetch(`${baseUrl}/api/Baskets/UpdateBasket`,{
            method:`PUT`,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((data) => {
            getProductsAll();
        })
        .catch(error => console.error("Error fetching Products:", error));
    
}else{
    console.error(`product not found`);
    
}
}


// hamburger click function

let hamburger = document.querySelector(`.hamburger`)
let offScreenMenu = document.querySelector(`.offScreenMenu`)

function onHamBtnClick() {
    offScreenMenu.style.visibility = "visible";
}
function onHamCloseBtnClick() {
    offScreenMenu.style.visibility = "hidden";
}