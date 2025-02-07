let baseUrl = `https://railway.stepprojects.ge`;
let stationsArray = [];

function getStations() {
    fetch(`${baseUrl}/api/stations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        stationsArray = data; // Store the data
        populateDropdowns(stationsArray); // Populate dropdowns
    })
    .catch(error => console.error("Error fetching stations:", error));
}

function populateDropdowns(stations) {
    const dropdowns = document.querySelectorAll('.dropdown'); // Select all dropdowns
    dropdowns.forEach((dropdown, index) => {
        // Skip the first option ("disabled selected") and clear existing options
        dropdown.innerHTML = index === 0 
            ? '<option disabled selected>საიდან</option>' 
            : '<option disabled selected>სად</option>';
        
        // Add station options
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id; // Use the station's ID as the value
            option.textContent = station.name; // Display station name
            dropdown.appendChild(option);
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    getStations();
});

document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    const fromStation = document.getElementById('fromStation').value;
    const toStation = document.getElementById('toStation').value;
    const travelDate = document.getElementById('travelDate').value;
    const passengers = document.getElementById('passengers').value;

    if (!fromStation || !toStation || !travelDate || !passengers) {
        alert("გთხოვთ, შეავსეთ ყველა ველი");
        return;
    }

    const searchData = {
        fromStation,
        toStation,
        travelDate,
        passengers
    };

    console.log("Search Data:", searchData);
    // Send searchData to your backend or another API to fetch train data
});
