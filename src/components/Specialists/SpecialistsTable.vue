<script setup>
import { ref, onMounted } from 'vue'
import { DataTable, Column } from 'primevue'
import { getSpecialists } from '@/repository/UserRepository' // Import the getSpecialists method

const specialists = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10) // Number of rows per page
const currentPage = ref(0) // Current page number

// Fetch specialists from the repository with pagination and sorting
const fetchSpecialists = async (page = 0, rows = 10, sortField = '', sortOrder = 1) => {
  try {
    loading.value = true
    const response = await getSpecialists(page, rows, sortField, sortOrder) // Call the repository method
    specialists.value = response.data // Assign the fetched specialist data
    totalRecords.value = response.total // Assign the total number of records
    loading.value = false
  } catch (err) {
    console.error('Error fetching specialists:', err)
    loading.value = false
  }
}

onMounted(() => {
  fetchSpecialists() // Fetch specialists on mount
})

// Handle pagination events
const onPage = (event) => {
  currentPage.value = event.page
  fetchSpecialists(event.page, event.rows, event.sortField, event.sortOrder)
}

// Handle sorting events
const onSort = (event) => {
  fetchSpecialists(currentPage.value, rowsPerPage.value, event.sortField, event.sortOrder)
}
</script>

<template>
  <div>
    <h2 class="text-center">Specialists List</h2>

    <!-- Specialists Data Table -->
    <DataTable
      :value="specialists"
      :loading="loading"
      :rows="rowsPerPage"
      :paginator="true"
      :total-records="totalRecords"
      :lazy="true"
      @page="onPage"
      @sort="onSort"
      :sortField="sortField"
      :sortOrder="sortOrder"
    >
      <!-- Columns with built-in filters -->
      <Column
        field="firstName"
        header="First Name"
        sortable
        filter
        filterPlaceholder="Search by first name"
      />
      <Column
        field="lastName"
        header="Last Name"
        sortable
        filter
        filterPlaceholder="Search by last name"
      />
      <Column field="email" header="Email" sortable filter filterPlaceholder="Search by email" />
      <Column
        field="phoneNumber"
        header="Phone Number"
        sortable
        filter
        filterPlaceholder="Search by phone number"
      />
      <Column
        field="location"
        header="Location"
        sortable
        filter
        filterPlaceholder="Search by location"
      />
    </DataTable>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
