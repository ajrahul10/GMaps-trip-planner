// Instantiate a directions service.
const directionsService = new google.maps.DirectionsService();
// Create a map and center it on Manhattan.
const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 3,
  center: { lat: 40.771, lng: -73.974 },
});
// Create a renderer for directions and bind it to the map.
const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

const markerArray = [];

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

    let maxDriveHours = document.getElementById("maxHours").value;
    if(maxDriveHours.trim().length === 0 || +maxDriveHours <= 0) {
      return;
    }
    // First, remove any existing markers from the map.
    for (let i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
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
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
  
  function showSteps(directionResult, markerArray, stepDisplay, map, maxDriveHours) {

    const myRoute = directionResult.routes[0].legs[0];
    const totalTime = myRoute.duration.value;
    const driveHours = maxDriveHours * 3600;

    let divided_parts = round(totalTime, driveHours);

    const overview_path = directionResult.routes[0].overview_path;
    let route_length = overview_path.length;
    for (let i = 0; i < divided_parts; i++) {
          const marker = (markerArray[i] =
            markerArray[i] || new google.maps.Marker());
          marker.setMap(map);
          
          marker.setPosition(overview_path[Math.floor((i+1) * (route_length / divided_parts) - 1)]);
          attachInstructionText(
            stepDisplay,
            marker,
            'Stop ' + (i+1),
            map
          );
      }

  }
  
function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, "click", () => {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}

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

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
