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

const db = getFirestore()
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PK_TOKEN

const mapContainer = ref(null)
let map = null
const userCoordinates = ref([0, 0])
const locations = ref([])

onMounted(async () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userCoordinates.value = [position.coords.longitude, position.coords.latitude]
      initializeMap(userCoordinates.value)
      fetchLocations().then(displayPOIs)
    },
    (error) => {
      console.error('Error getting user location:', error)
      initializeMap([-74.5, 40]) // Fallback location
      fetchLocations().then(displayPOIs)
    }
  )
})

const initializeMap = (coordinates) => {
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 12
  })

  new mapboxgl.Marker({ color: 'blue' })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Your Location'))
    .addTo(map)
}

const fetchLocations = async () => {
  try {
    const specialistsQuery = query(collection(db, 'users'), where('userType', '==', 'specialist'))
    const specialistsSnapshot = await getDocs(specialistsQuery)
    specialistsSnapshot.forEach((doc) => {
      locations.value.push({
        type: 'Specialist',
        name: `${doc.data().firstName} ${doc.data().lastName}`,
        address: doc.data().location
      })
    })

    const clinicsSnapshot = await getDocs(collection(db, 'clinics'))
    clinicsSnapshot.forEach((doc) => {
      locations.value.push({
        type: 'Clinic',
        name: doc.data().name,
        address: doc.data().location
      })
    })

    const eventsSnapshot = await getDocs(collection(db, 'events'))
    eventsSnapshot.forEach((doc) => {
      locations.value.push({
        type: 'Event',
        name: doc.data().name,
        address: doc.data().location
      })
    })
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
}

const geocodeAddress = async (address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
  try {
    const response = await axios.get(url)
    const features = response.data.features

    if (features && features.length > 0) {
      return features[0].center
    } else {
      console.error(`No geocoding results for address: ${address}`)
      return null
    }
  } catch (error) {
    console.error('Error geocoding address:', error)
    return null
  }
}

const addMarker = (coordinates, name, address, type) => {
  // Set marker color based on type
  let color
  switch (type) {
    case 'Specialist':
      color = 'red'
      break
    case 'Clinic':
      color = 'lime'
      break
    case 'Event':
      color = 'orange'
      break
    default:
      color = 'blue' // Default color
  }

  new mapboxgl.Marker({ color: color })
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3>${name}</h3>
        <h4>${type}</h4>
        <p>${address}</p>
        <button class="navigate-btn" data-coordinates='${JSON.stringify(coordinates)}' data-name="${name}">Navigate</button>
      `)
    )
    .addTo(map)
}

const displayPOIs = async () => {
  for (const location of locations.value) {
    const coordinates = await geocodeAddress(location.address)
    if (coordinates) {
      addMarker(coordinates, location.name, location.address, location.type)
    }
  }

  document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('navigate-btn')) {
      const coordinates = JSON.parse(event.target.getAttribute('data-coordinates'))
      const name = event.target.getAttribute('data-name')
      navigateToLocation(coordinates, name)
    }
  })
}

const navigateToLocation = async (destinationCoordinates, destinationName) => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const startCoordinates = [position.coords.longitude, position.coords.latitude]

    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates.join(',')};${destinationCoordinates.join(',')}.json?access_token=${mapboxgl.accessToken}&geometries=geojson`

    try {
      const response = await axios.get(directionsUrl)
      const route = response.data.routes[0].geometry

      if (map.getSource('route')) {
        map.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: route
        })
      } else {
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
  height: 100%;
  max-width: 100vw;
}

.map {
  flex-grow: 1;
  width: 100%;
}
</style>
