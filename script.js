let baseUrl = `https://railway.stepprojects.ge`;
let stationsArray = [];
let departuresArray = [];
let test = document.querySelector(`.test`)

// get stations

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
    })
    .catch(error => console.error("Error fetching Stations:", error));
}

// populate dropdowns with stations

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

// get departures

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
    .catch(error => console.error("Error fetching Stations:", error));
}


// generate visual

function generateVisual() {
    let ticket_text_div = document.querySelector(`.ticket-text-div`); 
    let form_div = document.querySelector(`.form-div`); 
    let banner_div = document.querySelector(`.banner-div`); 

    ticket_text_div.innerHTML = '';
    form_div.innerHTML = '';
    banner_div.style.cssText = "display:flex; align-items: start; justify-content: start; padding:1rem 0 0 1rem; height: 15rem; font-size: 20px; color: white; background: var(--base)";
    banner_div.innerHTML = `<span>აირჩიეთ თქვენთვის სასურველი მატარებელი</span>`;

    let empty = '';

    departuresArray.forEach(departure => {
        departure.trains.forEach(train => {
            empty += `<ul class="departures-cards">
                        <li>#${train.number} <br> ${train.name} Express</li>
                        <li>${train.departure} <br> ${train.from}</li>
                        <li>${train.arrive} <br> ${train.to}</li>
                        <button class="default-btn">დაჯავშნა</button>
                      </ul>`;
        });
    });
        
    test.innerHTML = empty;
}


// filter departures on button click
function onFilterBtnClick(event) {
    // Prevent the form submission (page reload)
    event.preventDefault();

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

    console.log(departuresArray);
    
}

// Add event listener to filter button
document.querySelector('button[type="submit"]').addEventListener('click', onFilterBtnClick);

getStations();
getDepartures();



