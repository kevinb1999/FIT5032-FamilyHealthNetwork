<script setup>
import { ref, onMounted } from 'vue'
import { DataTable, Column } from 'primevue'
import { getSpecialists } from '@/repository/UserRepository'

const specialists = ref([])
const loading = ref(false)
const totalRecords = ref(0)

// Fetch specialists from the repository with pagination and sorting
const fetchSpecialists = async () => {
  try {
    loading.value = true
    const response = await getSpecialists()
    specialists.value = response.data
    totalRecords.value = response.total
    loading.value = false
  } catch (err) {
    console.error('Error fetching specialists:', err)
    loading.value = false
  }
}

onMounted(() => {
  fetchSpecialists() // Fetch specialists on mount
})

defineExpose({
  fetchData
})
</script>

<template>
  <div>
    <h2 class="text-center" aria-label="Specialists List">Specialists List</h2>

    <!-- Specialists Data Table -->
    <DataTable
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      removableSort
      :value="specialists"
      :loading="loading"
      :total-records="totalRecords"
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
