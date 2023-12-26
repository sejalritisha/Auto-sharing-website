var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
//
function storeUserInput() {
    var userInput1 = document.getElementById('sourceBox').value;
    var userInput2 = document.getElementById('destinationBox').value;


    // Check if local storage is supported
    if (typeof(Storage) !== "undefined") {
        // Store user input in local storage
        localStorage.setItem('userInput1', userInput1);
        localStorage.setItem('userInput2', userInput2);
        // alert('User input has been stored.');
    } else {
        alert('Sorry, your browser does not support local storage.');
    }
}
//
var pathLayer = L.layerGroup().addTo(map);
var marker = L.marker([0, 0]).addTo(map); // Initialize a marker

map.on('click', function (e) {
    var locationName = prompt('Enter location name:');
    handleMapClick(e, locationName);
});

function handleMapClick(e, locationName) {
    console.log(`Clicked at (${e.latlng.lat}, ${e.latlng.lng}) - Location Name: ${locationName}`);

    // You can use the locationName as needed in your application.

    // Clear previous paths and markers
    pathLayer.clearLayers();
    marker.setLatLng(e.latlng);

    // Set the locationName to the source input box (for example)
    document.getElementById('sourceBox').value = locationName;
}
 
 
function calculateRoute1() {
    var sourceValue = document.getElementById('sourceBox').value;
    var destinationValue = document.getElementById('destinationBox').value;


    // Use OpenStreetMap Nominatim for geocoding
    var sourcePromise = fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${sourceValue}`)
        .then(response => response.json());

    var destinationPromise = fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destinationValue}`)
        .then(response => response.json());
     

    Promise.all([sourcePromise, destinationPromise])
        .then(data => {
            if (data[0].length === 0 || data[1].length === 0) {
                throw new Error('Location not found');
            }

            var sourceLocation = [data[0][0].lat, data[0][0].lon];
            var destinationLocation = [data[1][0].lat, data[1][0].lon];
             
            map.setView(sourceLocation, 10);
             

            // Clear previous paths and markers
            pathLayer.clearLayers();
            marker.setLatLng(sourceLocation);
             

            // Show path between source and destination using Leaflet Routing Machine
            L.Routing.control({
                waypoints: [
                    L.latLng(sourceLocation),
                    L.latLng(destinationLocation)
                ]
                 
            })//.on('routesfound', function (e) {
                
            //     e.routes[0].coordinates.forEach(function (coord, index) {
            //         setTimeout(() => {
            //             marker.setLatLng([coord.lat, coord.lng])
            //         }, 100 * index);
            //     })
            //      gdis = e.routes[0].summary.totalDistance;
            //     console.log(gdis);
            // })
            .addTo(map);
             
        })
         
         
        .catch(error => {
            console.error('Error:', error.message);
            alert("Error: " + error.message);
        });
}
function bookAuto(){
    var m =100;
    var outputDiv = document.getElementById('output');
    outputDiv.innerHTML =gdis;
}