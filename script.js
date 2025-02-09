let baseUrl = `https://railway.stepprojects.ge`;
let stationsArray = [];
let trainsArray = [];
let departureArray = [];


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
    .catch(error => console.error("Error fetching stations:", error));
}


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
    .catch(error => console.error("Error fetching stations:", error));
}

function getDeparture() {
    fetch(`${baseUrl}/api/getdeparture${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        departureArray = data; 
    })
    .catch(error => console.error("Error fetching stations:", error));
}


document.addEventListener('DOMContentLoaded', () => {
    getStations();
});

function onFilterBtnClick(){

    document.getElementById('ticket-form').addEventListener('submit', function(e) {
        e.preventDefault()})

        const fromStation = document.getElementById('fromStation').value;
        const toStation = document.getElementById('toStation').value;
        const travelDate = document.getElementById('travelDate').value;

    let queryArray = [];

    if(fromStation != 'საიდან'){
        queryArray.push(`from=${fromStation}`)
    }
    if(toStation != 'სად'){
        queryArray.push(`to=${toStation}`)
    }
    if(travelDate != ''){
        queryArray.push(`date=${travelDate}`)
    }

    let query = '';
    if(queryArray.length > 0){
        query = '?' + queryArray.join('&')
    }

    location.replace(`./train_filter_page.html${query}`)

    generateVisual();
    
    
}

function generateVisual(){
    let empty = 0;

    departureArray.forEach((departure) => {
        empty += `from: ${fromStation}, to=${toStation}, date=${travelDate}`
    })
    const test = document.getElementById('test');
    test.innerHTML = empty;
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const fromStation = params.get('from');
    const toStation = params.get('to');
    const travelDate = params.get('date');

    console.log('Query:', { fromStation, toStation, travelDate }); 

    const test = document.getElementById('test');
    if (test) {
        test.innerHTML = `From: ${fromStation || 'N/A'}, To: ${toStation || 'N/A'}, Date: ${travelDate || 'N/A'}`;
    }
}



document.addEventListener('DOMContentLoaded', getQueryParams);


getDeparture();
getTrains();

