# GMaps-trip-planner

This is a vanilla Javascript application which will help in planning your next road journey anywhere around world. 
It presents the World Map on the UI and suggest the fastest route between the source and desitnation entered by the user. 
Also by a simple concept of the max driving hours / day, it will auto suggest stops on your road trip. And help you finding nearby places for the night stay.

It uses Google Maps API to find out the driving route between source and destination.  
And using the reverse geocoding, finds out the nearest city or town from the 'Stop'. 

How to interact with the application:
Just enter the Origin, Destination and Driving hours/day for your journey to begin with. 
It will auto-suggest the Stops needed along the route. 

How to use the application:
1. Download zip and extract contents in your desktop folder.
2. Keep the application contents (index.js, index.html and style.css) inside the same folder location. 
3. Update your Google Maps API key in index.html line 24. 
4. Make sure you have enabled the Maps Directions, Maps Road, Maps Geolocation, Maps Geocoding and Maps Javascript Map APIs in your Google API console. 