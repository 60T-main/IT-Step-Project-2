let baseUrl = `https://railway.stepprojects.ge`;
let stationsArray = [];
let departuresArray = [];
let trainsArray = [];


let ticket_text_div = document.querySelector(`.ticket-text-div`);
let form_div = document.querySelector(`.form-div`);
let banner_div = document.querySelector(`.banner-div`);
let header_section = document.querySelector(`.header-section`);
let ticket_div = document.querySelector(`.ticket-div`);
let info_section = document.querySelector(`.info-section`);
let ticket_section = document.querySelector(`.ticket-section`)

let test = document.querySelector(`#test`); 



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
    ticket_section.style.height = "75rem";
 

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

    // Fix: Add event listeners to ALL buttons after they are rendered
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
    let selectedTrain = departuresArray[depIndex].trains[trainIndex];
    console.log("Reserved train:", selectedTrain);

    generateReserveVisual(selectedTrain)
    
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
                        <div class="seat"></div>
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

}

// Initial fetch calls
getStations();
getDepartures();
getTrains();

