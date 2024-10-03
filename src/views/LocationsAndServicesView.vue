<script setup>
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import axios from 'axios'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PK_TOKEN

const mapContainer = ref(null)
const pois = ref([
  { address: '1600 Pennsylvania Avenue NW, Washington, DC 20500', name: 'White House' },
  { address: 'Statue of Liberty National Monument, New York, NY 10004', name: 'Statue of Liberty' }
])

onMounted(async () => {
  // Initialize the map
  const map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40], // Initial center of the map
    zoom: 9
  })

  // Geocode POIs and add them as markers
  for (let poi of pois.value) {
    const coords = await geocodeAddress(poi.address)
    if (coords) {
      addMarker(map, coords, poi.name)
    }
  }
})

// Function to geocode addresses
const geocodeAddress = async (address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
  try {
    const response = await axios.get(url)
    const [longitude, latitude] = response.data.features[0].center
    return [longitude, latitude]
  } catch (error) {
    console.error('Error geocoding address:', error)
    return null
  }
}

// Function to add a marker to the map
const addMarker = (map, coordinates, name) => {
  new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(name)) // Add popup with name
    .addTo(map)
}
</script>

<template>
  <div ref="mapContainer" style="width: 100%; height: 500px"></div>
</template>

<style scoped>
#mapContainer {
  width: 100%;
  height: 500px;
}
</style>
