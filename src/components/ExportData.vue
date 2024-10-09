<template>
    <div class="export-component">
      <h3>Export Data</h3>
  
      <div class="form-group">
        <label for="collection">Select Collection:</label>
        <select v-model="selectedCollection" class="form-control">
          <option value="articles">Articles</option>
          <option value="clinics">Clinics</option>
          <option value="events">Events</option>
          <option value="newsletters">Newsletters</option>
          <option value="users">Users</option>
        </select>
      </div>
  
      <div class="form-group">
        <label for="format">Select Format:</label>
        <select v-model="selectedFormat" class="form-control">
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="json">JSON</option>
        </select>
      </div>
  
      <div class="form-group">
        <label for="dateRange">Select Date Range (optional):</label>
        <input type="date" v-model="startDate" class="form-control mb-2" placeholder="Start Date" />
        <input type="date" v-model="endDate" class="form-control" placeholder="End Date" />
      </div>
  
      <button @click="exportData" class="btn btn-primary">Export</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const selectedCollection = ref('articles')
  const selectedFormat = ref('csv')
  const startDate = ref(null)
  const endDate = ref(null)
  
  const exportData = async () => {
    const params = {
      collection: selectedCollection.value,
      format: selectedFormat.value,
      startDate: startDate.value,
      endDate: endDate.value,
    }
  
    try {
      const response = await axios.get(
        'cloud-funtion url', 
        { params, responseType: 'blob' } // `blob` for downloading files
      )
      
      // Trigger the file download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `data.${selectedFormat.value}`)
      document.body.appendChild(link)
      link.click()
    } catch (err) {
      console.error('Error exporting data:', err)
    }
  }
  </script>
  
  <style scoped>
  .export-component {
    max-width: 500px;
    margin: 0 auto;
  }
  </style>
  