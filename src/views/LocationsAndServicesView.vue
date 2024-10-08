<template>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

// Initialize Firestore
const db = getFirestore()

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PK_TOKEN

const mapContainer = ref(null)
let map = null
const userCoordinates = ref([0, 0]) // Store user's coordinates

// POIs data for specialists, clinics, and events (fetched from Firestore)
const locations = ref([])

onMounted(async () => {
  // Get user's current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userCoordinates.value = [position.coords.longitude, position.coords.latitude]

      // Initialize the map after getting the user's location
      map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userCoordinates.value, // Center the map on the user's location
        zoom: 12
      })

      // Add a marker for the user's current location
      new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(userCoordinates.value)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Your Location'))
        .addTo(map)

      // Fetch and display all POIs on the map
      fetchLocations().then(displayPOIs)
    },
    (error) => {
      console.error('Error getting user location:', error)
      // Fallback: Initialize the map at a default location if geolocation fails
      map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // Fallback to a default location (New York City)
        zoom: 9
      })

      // Fetch and display all POIs on the map
      fetchLocations().then(displayPOIs)
    }
  )
})

// Function to fetch locations for specialists, clinics, and events from Firestore
const fetchLocations = async () => {
  try {
    // Fetch specialists
    const specialistsQuery = query(collection(db, 'users'), where('userType', '==', 'specialist'))
    const specialistsSnapshot = await getDocs(specialistsQuery)
    specialistsSnapshot.forEach((doc) => {
      locations.value.push({
        type: 'specialist',
        name: doc.data().firstName + ' ' + doc.data().lastName,
        address: doc.data().location
      })
    })

    // Fetch clinics
    const clinicsSnapshot = await getDocs(collection(db, 'clinics'))
    clinicsSnapshot.forEach((doc) => {
      locations.value.push({
        type: 'clinic',
        name: doc.data().name,
        address: doc.data().location
      })
    })

    // Fetch events
    const eventsSnapshot = await getDocs(collection(db, 'events'))
    eventsSnapshot.forEach((doc) => {
      locations.value.push({
        type: 'event',
        name: doc.data().name,
        address: doc.data().location
      })
    })
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
}

// Function to geocode addresses and get coordinates
const geocodeAddress = async (address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
  try {
    const response = await axios.get(url)
    const features = response.data.features

    // Check if there are any results
    if (features && features.length > 0) {
      const [longitude, latitude] = features[0].center
      return [longitude, latitude]
    } else {
      console.error(`No geocoding results for address: ${address}`)
      return null
    }
  } catch (error) {
    console.error('Error geocoding address:', error)
    return null
  }
}

// Function to add a marker to the map
const addMarker = (coordinates, name, address) => {
  new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3>${name}</h3>
        <p>${address}</p>
        <button class="navigate-btn" data-coordinates='${JSON.stringify(coordinates)}' data-name="${name}">Navigate</button>
      `)
    )
    .addTo(map)
}

// Function to display all POIs on the map
const displayPOIs = async () => {
  for (const location of locations.value) {
    const coordinates = await geocodeAddress(location.address)
    if (coordinates) {
      addMarker(coordinates, location.name, location.address)
    }
  }

  // Add event listener to handle navigation
  document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('navigate-btn')) {
      const coordinates = JSON.parse(event.target.getAttribute('data-coordinates'))
      const name = event.target.getAttribute('data-name')
      navigateToLocation(coordinates, name)
    }
  })
}

// Function to show navigation directions
const navigateToLocation = async (destinationCoordinates, destinationName) => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const startCoordinates = [position.coords.longitude, position.coords.latitude]

    // Build the URL for the Mapbox Directions API
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates.join(',')};${destinationCoordinates.join(',')}.json?access_token=${mapboxgl.accessToken}&geometries=geojson`

    try {
      // Fetch the route from the Mapbox Directions API
      const response = await axios.get(directionsUrl)
      const route = response.data.routes[0].geometry

      // Check if the route exists, if yes, update it
      if (map.getSource('route')) {
        map.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: route
        })
      } else {
        // Add a new route layer if it doesn't exist
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        })
      }

      // Fit the map to the route
      const bounds = new mapboxgl.LngLatBounds(startCoordinates, startCoordinates)
      route.coordinates.forEach((coord) => bounds.extend(coord))
      map.fitBounds(bounds, { padding: 50 })
    } catch (error) {
      console.error('Error fetching directions:', error)
    }
  })
}
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* Make the container take the full height of its parent */
  max-width: 100vw; /* Prevent overflow horizontally */
}

.map {
  flex-grow: 1; /* Take up the remaining space */
  width: 100%; /* Ensure it fits within the container */
}
</style>
