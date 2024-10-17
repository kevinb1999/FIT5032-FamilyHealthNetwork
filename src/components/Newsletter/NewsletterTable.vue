<template>
  <div>
    <DataTable
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      removableSort
      :value="newsletters"
      :loading="loading"
      :total-records="totalRecords"
      aria-label="List of newsletters"
    >
      <!-- Radio Button for Selecting a Newsletter -->
      <Column>
        <template #body="slotProps">
          <input
            type="radio"
            name="selectedNewsletter"
            :value="slotProps.data"
            v-model="selectedNewsletter"
            aria-label="Select newsletter {{ slotProps.data.subject }}"
          />
        </template>
      </Column>

      <Column
        field="subject"
        header="Subject"
        sortable
        filter
        filterPlaceholder="Search by subject"
        aria-label="Search by subject"
      />
      <Column
        field="body"
        header="Body"
        sortable
        filter
        filterPlaceholder="Search by body"
        aria-label="Search by body"
      />
      <Column
        field="attachmentURL"
        header="Attachment"
        sortable
        filter
        filterPlaceholder="Search by attachment"
        aria-label="Search by attachment"
      />

      <!-- Format the dateCreated column -->
      <Column field="dateCreated" header="Date Created" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.dateCreated) }}
        </template>
      </Column>

      <Column header="Actions" bodyClass="text-center" v-if="!isPublic">
        <template #body="slotProps">
          <div class="d-flex justify-content-center">
            <!-- Edit Button -->
            <button
              type="button"
              class="btn btn-warning mr-2"
              @click="$emit('edit', slotProps.data)"
              aria-label="Edit newsletter {{ slotProps.data.subject }}"
              title="Edit newsletter"
            >
              <i class="pi pi-pencil" aria-hidden="true"></i> Edit
            </button>

            <!-- Delete Button -->
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDeleteNewsletter(slotProps.data.id)"
              aria-label="Delete newsletter {{ slotProps.data.subject }}"
              title="Delete newsletter"
            >
              <i class="pi pi-trash" aria-hidden="true"></i> Delete
            </button>
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Send Newsletter Button -->
    <button
      :disabled="!selectedNewsletter"
      @click="sendNewsletter"
      class="btn btn-primary mt-3"
      aria-label="Send selected newsletter"
    >
      Send Newsletter
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNewsletters, deleteNewsletter } from '@/repository/NewsletterRepository'

// Reactive variables
const newsletters = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const selectedNewsletter = ref(null)

// Function to fetch event data
function fetchData() {
  loading.value = true
  getNewsletters()
    .then((response) => {
      newsletters.value = response.data
      totalRecords.value = response.total
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

// Format the date from Firebase Timestamp
const formatDate = (timestamp) => {
  if (timestamp && typeof timestamp.seconds === 'number') {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  return 'Invalid date'
}

onMounted(() => {
  fetchData()
})

// Handle deleting a newsletter
const handleDeleteNewsletter = async (newsletterId) => {
  try {
    await deleteNewsletter(newsletterId)
    fetchData() // Refresh data after deletion
  } catch (error) {
    console.error('Error deleting newsletter:', error)
  }
}

// Function to send newsletter via Firebase Cloud Function
const sendNewsletter = async () => {
  if (!selectedNewsletter.value) return

  try {
    const response = await fetch(
      'http://127.0.0.1:5001/fit5032-familyhealthnetwork/us-central1/sendNewsletter',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newsletterId: selectedNewsletter.value.id })
      }
    )
    const result = await response.json()

    if (result.success) {
      console.log('Newsletter sent successfully')
    } else {
      console.error('Failed to send newsletter:', result.message)
    }
  } catch (error) {
    console.error('Error sending newsletter:', error)
  }
}

defineExpose({
  fetchData
})
</script>

<style scoped>
.text-center {
  text-align: center;
}
.me-2 {
  margin-right: 0.5rem;
}
</style>
