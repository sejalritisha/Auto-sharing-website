    var map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    // Function to store user input in local storage
   

    var pathLayer = L.layerGroup().addTo(map);
    var marker = L.marker([0, 0]).addTo(map); // Initialize a marker

    // map.on('click', function (e) {
    //     var locationName = prompt('Enter location name:');
    //     handleMapClick(e, locationName);
    // });
    
    // function handleMapClick(e, locationName) {
    //     console.log(`Clicked at (${e.latlng.lat}, ${e.latlng.lng}) - Location Name: ${locationName}`);

    //     // You can use the locationName as needed in your application.

    //     // Clear previous paths and markers
    //     pathLayer.clearLayers();
    //     marker.setLatLng(e.latlng);

    //     // Set the locationName to the source input box (for example)
    //     document.getElementById('sourceBox').value = locationName;
    // }
    var gdis=0;
    var gtime=0;
    // var dd="vasant kunj";
    var source1 = localStorage.getItem('userInput1');
    var destination1 = localStorage.getItem('userInput2');
    function calculateRoute(dd) {
        var sourceValue =  source1;
        var destinationValue = destination1;
        var destination1Value = dd ;
        var outputElement = document.getElementById("output");
        outputElement.innerHTML = "Your partner source: " + dd;

        // Use OpenStreetMap Nominatim for geocoding
        var sourcePromise = fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${sourceValue}`)
            .then(response => response.json());

        var destinationPromise = fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destinationValue}`)
            .then(response => response.json());
        var destination1Promise = fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destination1Value}`)
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
                     
                }).on('routesfound', function (e) {
                    
                    e.routes[0].coordinates.forEach(function (coord, index) {
                        setTimeout(() => {
                            marker.setLatLng([coord.lat, coord.lng]).setIcon(L.icon({
                                iconUrl: 'image/auto_mark.jpeg',  // Specify the path to your custom icon
                                iconSize: [32, 32],  // Adjust icon size as needed
                                iconAnchor: [16, 16],  // Adjust icon anchor point as needed
                                popupAnchor: [0, -16]  // Adjust popup anchor point as needed
                            }));
                            if (index === e.routes[0].coordinates.length - 1) {
                                // Display success message when the route is complete
                                alert('Route successfully completed!');
                                // bookAuto();
                                window.location.href = 'card.html';
                            }
                        }, 100 * index);
                    })
                     gdis = e.routes[0].summary.totalDistance;
                     gtime = e.routes[0].summary.totalTime;
                    console.log(gdis);
                })
                .addTo(map);
                 
            })
            Promise.all([destination1Promise, destinationPromise])
            .then(data => {
                if (data[0].length === 0 || data[1].length === 0) {
                    throw new Error('Location not found');
                }

                var destination1Location = [data[0][0].lat, data[0][0].lon];
                var destinationLocation = [data[1][0].lat, data[1][0].lon];
                 
                map.setView(destination1Location, 13);
                 

                // Clear previous paths and markers
                pathLayer.clearLayers();
                marker.setLatLng(destination1Location);
                 

                // Show path between source and destination using Leaflet Routing Machine
                L.Routing.control({
                    waypoints: [
                        L.latLng(destination1Location),
                        L.latLng(destinationLocation)
                    ]
                     
                }).on('routesfound', function (e) {
                    
                //     e.routes[0].coordinates.forEach(function (coord, index) {
                //         setTimeout(() => {
                //             marker.setLatLng([coord.lat, coord.lng])
                //         }, 100 * index);
                //     })
                    var dis = e.routes[0].summary.totalDistance;
                    console.log(dis);
                })
                .addTo(map);
                
            })
             
            .catch(error => {
                console.error('Error:', error.message);
                alert("Error: " + error.message);
            });
    }
    function calDist(){
        var ans=gdis/1000;
        var outputDiv = document.getElementById('dist');
        outputDiv.innerHTML ="Total distance: " + ans + "km";
        var ans2=gtime/60;
        var outputTiv = document.getElementById('time');
        outputTiv.innerHTML ="Total time: " + ans2 + "m";
        const initialFare = 25;  // Initial fare in rupees
        const perKilometerRate = 10;  // Fare per kilometer in rupees
        const perMinuteRate = 2;  // Fare per minute of waiting time in rupees
    
        // Get user input
        const distance = gdis/1000;
        const waitingTime = gtime/60;
        // Calculate fare
        const fare = initialFare + (distance * perKilometerRate) + (waitingTime * perMinuteRate);
    
        // Display the result
        const fareResultElement = document.getElementById("tfare");
        fareResultElement.textContent = `Estimated Fare: ₹${fare.toFixed(2)}`;
        var fare2= document.getElementById('fare');
        fare2.innerHTML ="Your fare: " +` ₹${fare.toFixed(2)/2}`;
    }

    
        // Fare calculation parameters (you may adjust these based on actual fare structure)
    
      