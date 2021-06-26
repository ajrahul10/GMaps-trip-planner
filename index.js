// Instantiate a directions service.
const directionsService = new google.maps.DirectionsService();
// Instantiate a geocoder service.
const geocoder = new google.maps.Geocoder();
// Create a map and center it on Manhattan, USA.
const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 3,
  center: { lat: 40.771, lng: -73.974 },
});
// Create a renderer for directions and bind it to the map.
const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

const markerArray = [];
let markerAddress = [];
let markerClickEvent = [];

function calcRoute() {
    
    // Instantiate an info window to hold step text.
    const stepDisplay = new google.maps.InfoWindow();
    // Display the route between the initial start and end selections.
    calculateAndDisplayRoute(
      directionsRenderer,
      directionsService,
      markerArray,
      stepDisplay,
      map
    );
  }
  
  function calculateAndDisplayRoute(
    directionsRenderer,
    directionsService,
    markerArray,
    stepDisplay,
    map
  ) {

    // if maxHours is not specified by user then send an alert message
    let maxDriveHours = document.getElementById("maxHours").value;
    if(maxDriveHours.trim().length === 0 || +maxDriveHours < 1) {
      alert('Request failed as Driving Hours / day is not specified or it is less 1');
      return;
    }
    // First, remove any existing markers from the map.
    for (let i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
      google.maps.event.removeListener(markerClickEvent[i]);
    }
    markerAddress = [];
    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route(
      {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === "OK" && result) {
          document.getElementById("warnings-panel").innerHTML =
            "<b>" + result.routes[0].warnings + "</b>";
          directionsRenderer.setDirections(result);
          showSteps(result, markerArray, stepDisplay, map, maxDriveHours);
        } else {
          window.alert("Directions request failed as Origin or Destination is not specified or incorrect");
        }
      }
    );
  }
  
  function showSteps(directionResult, markerArray, stepDisplay, map, maxDriveHours) {

    // find the route between source and destination
    const myRoute = directionResult.routes[0].legs[0];
    const totalJourneyTime = myRoute.duration.value;
    const drivingHoursPerDay = maxDriveHours * 3600;

    // calculate the number of stops with 'total time' and 'drive hours' specified by user
    let journeyCount = round(totalJourneyTime, drivingHoursPerDay);

    // find all the waypoints in the direction
    const overview_path = directionResult.routes[0].overview_path;

    let route_length = overview_path.length;
    // split the total journey into multiple stops and placing the markers on the map

    for (let i = 0; i < journeyCount; i++) {
          const marker = (markerArray[i] =
            markerArray[i] || new google.maps.Marker());
          marker.setMap(map);
          
          let stopLocation = overview_path[Math.floor((i+1) * (route_length / journeyCount) - 1)];
          // set the stop marker along the direction 
          marker.setPosition(stopLocation);
          
          attachInstructionText(
            stepDisplay,
            marker,
            map, 
            i
          );
    }
    
  }

  
function attachInstructionText(stepDisplay, marker, map, i) {
  markerClickEvent[i] = google.maps.event.addListener(marker, "click", () => {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    if(!markerAddress[i]) {
      // finding nearest locality name through reverse geocoding
      // and adding on the display when the marker is clicked
      geocoder.geocode({location: marker.position}).then(res => {
        if(res.results[0]) {
          let locAddress = res.results[0].formatted_address.split(',');
          let len = locAddress.length;

          // attach the instruction text
          let text = `<b>Stop ${i+1}</b><br />${locAddress[len-3]}, ${locAddress[len-2]}, ${locAddress[len-1]}`;
          markerAddress[i] = text;
          stepDisplay.setContent(text);
          stepDisplay.open(map, marker);
        } else {
          // attach the instruction text
          let text = `<b>Stop ${i+1}</b>`;
          markerAddress[i] = text;
          stepDisplay.setContent(text);
          stepDisplay.open(map, marker);
        }
      });
    } else {
      stepDisplay.setContent(markerAddress[i]);
      stepDisplay.open(map, marker);
    }
  });
}

// rounding off the total stops throughout the journey 
var round = function(totalTime, maxHours) {
  let n = totalTime / maxHours;
  var h = (n * 100) % 100;
  return h >= 15
      ? Math.ceil(totalTime/maxHours)
      : Math.floor(totalTime/maxHours);
};

var options = {
  types: ['(cities)']
}

// autocomplete input buttons on the UI
var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
