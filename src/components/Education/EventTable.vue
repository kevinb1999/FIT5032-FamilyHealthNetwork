<template>
  <div>
    <DataTable
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      removableSort
      :value="formattedEvents"
      :loading="loading"
      :total-records="totalRecords"
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
        field="dateTimeFormatted"
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
              class="btn btn-warning mr-2"
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
import { ref, computed, onMounted } from 'vue'
import { getEvents, deleteEvent } from '@/repository/EventRepository'

const events = ref([])
const loading = ref(false)
const totalRecords = ref(0)

// Function to fetch event data
function fetchData() {
  loading.value = true
  getEvents()
    .then((response) => {
      events.value = response.data
      totalRecords.value = response.total
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

// Format dateTime for better readability
const formattedEvents = computed(() => {
  return events.value.map((event) => {
    const formattedDateTime = new Intl.DateTimeFormat('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(event.dateTime))
    return { ...event, dateTimeFormatted: formattedDateTime }
  })
})

// Lifecycle hook to fetch data when the component is mounted
onMounted(() => {
  fetchData()
})

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
