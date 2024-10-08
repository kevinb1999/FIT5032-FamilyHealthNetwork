<script setup>
import { ref, onMounted } from 'vue'
import { getEvents } from '@/repository/EventRepository' // Import the getEvents method

const events = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10) // Number of rows per page
const currentPage = ref(0) // Current page number
const sortField = ref('')
const sortOrder = ref(1)

// Fetch events from the repository with pagination and sorting
const fetchEvents = async (page = 0, rows = 10, sortField = '', sortOrder = 1) => {
  try {
    loading.value = true
    const response = await getEvents(page, rows, sortField, sortOrder) // Call the repository method
    events.value = response.data // Assign the fetched event data
    totalRecords.value = response.total // Assign the total number of records
    loading.value = false
  } catch (err) {
    console.error('Error fetching events:', err)
    loading.value = false
  }
}

onMounted(() => {
  fetchEvents() // Fetch events on mount
})

// Handle pagination events
const onPage = (event) => {
  currentPage.value = event.page
  fetchEvents(event.page, event.rows, event.sortField, event.sortOrder)
}

// Handle sorting events
const onSort = (event) => {
  fetchEvents(currentPage.value, rowsPerPage.value, event.sortField, event.sortOrder)
}
</script>

<template>
  <div>
    <!-- Event Data Table -->
    <DataTable
      :value="events"
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
      <Column field="name" header="Event Name" sortable filter filterPlaceholder="Search by name" />
      <Column
        field="dateTime"
        header="Date & Time"
        sortable
        filter
        filterPlaceholder="Search by date"
      />
      <Column
        field="duration"
        header="Duration"
        sortable
        filter
        filterPlaceholder="Search by duration"
      />
      <Column
        field="location"
        header="Location"
        sortable
        filter
        filterPlaceholder="Search by location"
      />
      <Column
        field="description"
        header="Description"
        sortable
        filter
        filterPlaceholder="Search by description"
      />

      <!-- Delete Action Column -->
      <Column header="Actions" bodyClass="text-center">
        <template #body="slotProps">
          <Button
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="handleDeleteUser(slotProps.data.id, slotProps.data.authUid)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
