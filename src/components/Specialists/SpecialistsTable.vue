<script setup>
import { ref, onMounted } from 'vue'
import { DataTable, Column } from 'primevue'
import { getSpecialists } from '@/repository/UserRepository'

const specialists = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10) // Number of rows per page
const currentPage = ref(0) // Current page number
const sortField = ref('') // Field to sort by
const sortOrder = ref(1) // Sort order

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
  fetchSpecialists(event.page, event.rows, sortField.value, sortOrder.value)
}

// Handle sorting events
const onSort = (event) => {
  fetchSpecialists(currentPage.value, rowsPerPage.value, event.sortField, event.sortOrder)
}
</script>

<template>
  <div>
    <h2 class="text-center" aria-label="Specialists List">Specialists List</h2>

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
      aria-label="Table listing specialists"
    >
      <Column
        field="firstName"
        header="First Name"
        sortable
        filter
        filterPlaceholder="Search by first name"
        aria-label="First Name"
      />
      <Column
        field="lastName"
        header="Last Name"
        sortable
        filter
        filterPlaceholder="Search by last name"
        aria-label="Last Name"
      />
      <Column
        field="email"
        header="Email"
        sortable
        filter
        filterPlaceholder="Search by email"
        aria-label="Email"
      />
      <Column
        field="phoneNumber"
        header="Phone Number"
        sortable
        filter
        filterPlaceholder="Search by phone number"
        aria-label="Phone Number"
      />
      <Column
        field="location"
        header="Location"
        sortable
        filter
        filterPlaceholder="Search by location"
        aria-label="Location"
      />
    </DataTable>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
