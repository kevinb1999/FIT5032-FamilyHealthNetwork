<template>
  <div>
    <DataTable
      :value="events"
      :loading="loading"
      :rows="rowsPerPage"
      :paginator="true"
      :total-records="totalRecords"
      :lazy="true"
      @page="onPage"
      @sort="onSort"
      @filter="onFilter"
      :sortField="sortField"
      :sortOrder="sortOrder"
      :filters="filters"
      aria-label="List of events"
    >
      <Column
        field="name"
        header="Event Name"
        sortable
        filter
        filterPlaceholder="Search by name"
        aria-label="Search by event name"
      />
      <Column
        field="dateTime"
        header="Date & Time"
        sortable
        filter
        filterPlaceholder="Search by date"
        aria-label="Search by date and time"
      />
      <Column
        field="duration"
        header="Duration"
        sortable
        filter
        filterPlaceholder="Search by duration"
        aria-label="Search by duration"
      />
      <Column
        field="location"
        header="Location"
        sortable
        filter
        filterPlaceholder="Search by location"
        aria-label="Search by location"
      />
      <Column
        field="description"
        header="Description"
        sortable
        filter
        filterPlaceholder="Search by description"
        aria-label="Search by description"
      />
      <Column header="Actions" bodyClass="text-center">
        <template #body="slotProps">
          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-warning me-2"
              @click="$emit('edit', slotProps.data)"
              aria-label="Edit event {{ slotProps.data.name }}"
            >
              <i class="pi pi-pencil" aria-hidden="true"></i> Edit
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDeleteEvent(slotProps.data.id)"
              aria-label="Delete event {{ slotProps.data.name }}"
            >
              <i class="pi pi-trash" aria-hidden="true"></i> Delete
            </button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getEvents, deleteEvent } from '@/repository/EventRepository'

const events = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const currentPage = ref(0)
const sortField = ref('')
const sortOrder = ref(1)

// Function to fetch event data
function fetchData() {
  loading.value = true
  getEvents(currentPage.value, rowsPerPage.value, sortField.value, sortOrder.value)
    .then((response) => {
      events.value = response.data
      totalRecords.value = response.total
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

// Lifecycle hook to fetch data when the component is mounted
onMounted(() => {
  fetchData()
})

// Pagination and sorting handlers
const onPage = (event) => {
  currentPage.value = event.page
  fetchData()
}

const onSort = (event) => {
  fetchData()
}

// Delete event handler
const handleDeleteEvent = async (eventId) => {
  try {
    await deleteEvent(eventId)
    fetchData() // Refresh data after deletion
  } catch (error) {
    console.error('Error deleting event:', error)
  }
}

// Expose the fetchData function to the parent component
defineExpose({
  fetchData
})
</script>

<style scoped>
.text-center {
  text-align: center;
}
.me-2 {
  margin-right: 0.5rem; /* Small gap between buttons */
}
</style>
