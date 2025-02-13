let baseUrl = `https://railway.stepprojects.ge`;
let stationsArray = [];
let departuresArray = [];
let trainsArray = [];
let passengersArray = [null, null, null, null];
let wagons = [];
let selectedTrain = [];


let ticket_text_div = document.querySelector(`.ticket-text-div`);
let form_div = document.querySelector(`.form-div`);
let banner_div = document.querySelector(`.banner-div`);
let header_section = document.querySelector(`.header-section`);
let ticket_div = document.querySelector(`.ticket-div`);
let info_section = document.querySelector(`.info-section`);
let ticket_section = document.querySelector(`.ticket-section`)
let test = document.querySelector(`#test`); 
let pass_info = document.querySelector(`.pass-info-div-inner`);
let popup_div = document.querySelector(`.popup-div`);
let modal = document.querySelector(`.modal`);
let wagon_h3 = document.querySelector(`.wagon_h3`);
let modal_body = document.querySelector(`.modal-body`);
let train_div = document.querySelector(`.train`);


// find number of passangers
let pass = document.querySelector(`#pass-num`);
pass.addEventListener("change", () => {
    const value = parseInt(pass.value, 10);

    if (!isNaN(value) && value > 0) {
        passengersArray = Array(value).fill(null);
        console.log(passengersArray);
    } else {
        alert("გთხოვთ შეიყვანოთ მგზავრების რაოდენობა");
    }
});




// Get stations
function getStations() {
    fetch(`${baseUrl}/api/stations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        stationsArray = data;
        populateDropdowns(stationsArray);
        restoreFilters(); // Restore previous selections after stations load
    })
    .catch(error => console.error("Error fetching Stations:", error));
}

// Populate dropdowns with stations
function populateDropdowns(stations) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach((dropdown, index) => {
        dropdown.innerHTML = index === 0 
            ? '<option disabled selected>საიდან</option>' 
            : '<option disabled selected>სად</option>';
        
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id;
            option.textContent = station.name;
            dropdown.appendChild(option);
        });
    });
}

// Get departures
function getDepartures() {
    fetch(`${baseUrl}/api/departures`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        departuresArray = data;
    })
    .catch(error => console.error("Error fetching departures:", error));
}

// Generate visual
function generateVisual() {

    ticket_text_div.innerHTML = '';
    form_div.innerHTML = '';
    info_section.innerHTML = '';
    banner_div.style.cssText = "display:flex; align-items: start; justify-content: start; padding:1rem 0 0 1rem; height: 15rem; font-size: 20px; color: white; background: var(--base)";
    banner_div.innerHTML = `<span>აირჩიეთ თქვენთვის სასურველი მატარებელი</span>`;
    header_section.classList.toggle('no-background');
    ticket_div.classList.toggle(`version2`);
 

    let empty = `<ul class="departures-cards">
                        <li><h3>მატარებლის სახელი</h3></li>
                        <li><h3>გამგზავრება</h3></li>
                        <li><h3>ჩასვლა</h3></li>
                        <li></li>
                      </ul>`;

    departuresArray.forEach((departure, depIndex) => {
        departure.trains.forEach((train, trainIndex) => {
            empty += `
                    <ul class="departures-cards">
                        <li>#${train.number} <br> ${train.name} Express</li>
                        <li>${train.departure} <br> ${train.from}</li>
                        <li>${train.arrive} <br> ${train.to}</li>
                        <button class="default-btn reserveBtn" data-departure="${depIndex}" data-train="${trainIndex}">დაჯავშნა</button>
                    </ul>`;
        });
    });

    test.innerHTML = empty;

    document.querySelectorAll(`.reserveBtn`).forEach(button => {
        button.addEventListener(`click`, onReserveBtnClick);
    });
}

// Filter departures on button click
function onFilterBtnClick(event) {
    if (event) event.preventDefault();

    let fromStation = document.querySelector(`#fromStation`);
    let toStation = document.querySelector(`#toStation`);
    let date = document.querySelector(`#travelDate`);
    let queryArray = [];

    if (fromStation.value !== 'საიდან' && toStation.value !== 'სად') {
        const fromStationName = fromStation.options[fromStation.selectedIndex].textContent;
        const toStationName = toStation.options[toStation.selectedIndex].textContent;

        queryArray.push(`from=${fromStationName}`);
        queryArray.push(`to=${toStationName}`);
        queryArray.push(`date=${date.value}`);

        // Save selections to localStorage
        localStorage.setItem("fromStation", fromStation.value);
        localStorage.setItem("toStation", toStation.value);
        localStorage.setItem("travelDate", date.value);
    }

    let query = '';
    if (queryArray.length > 0) {
        query = '?' + queryArray.join('&');
    }

    fetch(`${baseUrl}/api/getdeparture${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        departuresArray = data;
        generateVisual();
    })
    .catch(error => console.error("Error fetching departures:", error));

    console.log(queryArray);


    
    
}

// Restore previous filter selections on page load
function restoreFilters() {
    let fromStation = document.querySelector(`#fromStation`);
    let toStation = document.querySelector(`#toStation`);
    let date = document.querySelector(`#travelDate`);

    let savedFrom = localStorage.getItem("fromStation");
    let savedTo = localStorage.getItem("toStation");
    let savedDate = localStorage.getItem("travelDate");

    if (savedFrom) fromStation.value = savedFrom;
    if (savedTo) toStation.value = savedTo;
    if (savedDate) date.value = savedDate;

    // Apply filters automatically if all values exist
    if (savedFrom && savedTo && savedDate) {
        onFilterBtnClick(); // Trigger filtering after restoring selections
    }
}

// Add event listener to filter button
document.querySelector('button[type="submit"]').addEventListener('click', onFilterBtnClick);


// Get Trains
function getTrains() {
    fetch(`${baseUrl}/api/trains`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        trainsArray = data;
    })
    .catch(error => console.error("Error fetching Trains:", error));
}

// goes to seat reserve page
function onReserveBtnClick(event) {
    if (event) event.preventDefault();

    let depIndex = event.target.getAttribute("data-departure");
    let trainIndex = event.target.getAttribute("data-train");
    selectedTrain = departuresArray[depIndex].trains[trainIndex];
    console.log("Reserved train:", selectedTrain);
    

    filterTrains();
    
}

function filterTrains() {
    fetch(`${baseUrl}/api/trains/${selectedTrain.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        trainsArray = data;
        generateReserveVisual(selectedTrain);
        getWagonsId()
    })
    .catch(error => console.error("Error fetching Trains:", error));
}


// Get Wagons
function getWagons() {
    fetch(`${baseUrl}/api/vagons`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        wagons = data;
        
    })
    .catch(error => console.error("Error fetching Wagons:", error));
}
// Get Wagons id
function getWagonsId() {
    if (!selectedTrain || !selectedTrain.id) {
        console.error("No train selected or train ID is missing.");
        return;
    }

    fetch(`${baseUrl}/api/getvagon/${selectedTrain.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            console.log("No wagons found for this train.");
            return;
        }
        wagons = data;
        console.log("Fetched wagons:", wagons);
    })
    .catch(error => {
        console.error("Error fetching wagons:", error);
    });
}


// generate visual for seat reserve page

function generateReserveVisual(train){
    test.innerHTML= `<ul class="departures-cards">
                        <li class="departures-li">#${train.number} <br> ${train.name} Express</li>
                        <li class="departures-li">${train.departure} <br> ${train.from}</li>
                        <li class="departures-li">${train.arrive} <br> ${train.to}</li>
                    </ul>
                    <div class="invoice-div">
                    <h3>ინვოისი</h3>
                    <div class="title-div">
                        <h4>ადგილი</h4>
                        <h4>ფასი</h4>
                    </div>
                    <div class="content-div">
                        <div class="seatNum"></div>
                        <div class="price"></div>
                    </div>
                    <div class="sum-div">
                        <p>სულ</p>
                        <div class="sum"></div>
                    </div>
                </div>`
                    ;

    let departures_cards = document.querySelector(`.departures-cards`);
    departures_cards.classList.add(`departures-cards-2`)
    test.style.display = "flex";

    let empty1 = '';

for (let i = 0; i < passengersArray.length; i++) { 
    empty1 += `   <h3>მგზავრი: ${i + 1}</h3> 
    <form action="" class="input-form">
        <button class="default-btn">ადგილი:</button>
        <input placeholder="სახელი" type="text" class="dropdown1">
        <input placeholder="გვარი" type="text" class="dropdown1">
        <input placeholder="პირადი ნომერი" type="number" class="dropdown1">
        <button data-toggle="modal" data-target="#exampleModal" type="button" class="default-btn seat-select-btn">ადგილის არჩევა</button>
    </form>`; 
}

pass_info.innerHTML = empty1;

let seat_select_btn = document.querySelectorAll(`.seat-select-btn`);
seat_select_btn.forEach(button => {
    button.addEventListener(`click`, onSeatSelectBtnClick);
});

}



function getSeatId() {
    fetch(`${baseUrl}/api/seat/${wagons.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            console.log("No seats found for this wagon.");
            return;
        }
        wagons = data;
        console.log("Fetched wagons:", wagons);
    })
    .catch(error => {
        console.error("Error fetching wagons:", error);
    });
}

// seat selection
function onSeatSelectBtnClick() {
    let wagon_li = document.querySelectorAll(`.wagon-li`);
    wagon_li.forEach(button => {
        button.addEventListener(`click`, generateSeatsVisual)});
}


function generateSeatsVisual() {
    let seatsHtml = `<div class="train-layout">`;

    if (wagons.length === 0) {
        console.log("No wagons available.");
        return;
    }

    // Sorting seats properly (numerically and by letter)
    let sortedSeats = wagons[0].seats.sort((a, b) => {
        let numA = parseInt(a.number.match(/\d+/)[0]); // Extract number
        let numB = parseInt(b.number.match(/\d+/)[0]);
        let letterA = a.number.match(/[A-D]/)[0]; // Extract letter
        let letterB = b.number.match(/[A-D]/)[0];

        if (numA !== numB) return numA - numB; // Sort by row number
        return letterA.localeCompare(letterB); // Sort by seat letter
    });

    let totalRows = sortedSeats.length / 4;

    for (let i = 0; i < totalRows; i++) {
        let seatA = sortedSeats.find(seat => seat.number === `${i + 1}A`);
        let seatB = sortedSeats.find(seat => seat.number === `${i + 1}B`);
        let seatC = sortedSeats.find(seat => seat.number === `${i + 1}C`);
        let seatD = sortedSeats.find(seat => seat.number === `${i + 1}D`);

        seatsHtml += `
            <div class="seat-row">
                <button class="seat-btn" data-id="${seatA?.seatId || ''}" data-price="${seatA?.price || ''}">${seatA?.number || ''}</button>
                <button class="seat-btn" data-id="${seatB?.seatId || ''}" data-price="${seatB?.price || ''}">${seatB?.number || ''}</button>
                <div class="aisle"></div>
                <button class="seat-btn" data-id="${seatC?.seatId || ''}" data-price="${seatC?.price || ''}">${seatC?.number || ''}</button>
                <button class="seat-btn" data-id="${seatD?.seatId || ''}" data-price="${seatD?.price || ''}">${seatD?.number || ''}</button>
            </div>
        `;
    }

    seatsHtml += `</div>`;
    train_div.innerHTML = seatsHtml;

    // Add event listeners to seat buttons
    document.querySelectorAll(".seat-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            console.log(`Seat selected: ${event.target.dataset.id}`);
            let seatNum = document.querySelector(`.seatNum`);
            let price = document.querySelector(`.price`);
            let sum = document.querySelector(`.sum`);
            seatNum.innerHTML = event.target.innerText;
            price.innerHTML = event.target.dataset.price
            sum.innerHTML = event.target.dataset.price * passengersArray.length;
        });
    });
}









getStations();
getDepartures();
getTrains();
getWagons();

