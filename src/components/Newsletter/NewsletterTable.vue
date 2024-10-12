<template>
    <div>
      <h2 class="text-center">Newsletter List</h2>
      
      <!-- DataTable with Radio Buttons -->
      <DataTable
        :value="newsletters"
        :loading="loading"
        :rows="rowsPerPage"
        :paginator="true"
        :totalRecords="totalRecords"
        :lazy="true"
        @page="onPage"
        @sort="onSort"
        :sortField="sortField"
        :sortOrder="sortOrder"
      >
        <!-- Radio Button for Selecting a Newsletter -->
        <Column header="Select">
          <template #body="slotProps">
            <input
              type="radio"
              name="selectedNewsletter"
              :value="slotProps.data"
              v-model="selectedNewsletter"
            />
          </template>
        </Column>
  
        <Column field="subject" header="Subject" sortable />
        <Column field="body" header="Body" />
        <Column field="attachmentURL" header="Attachment" />
        
        <!-- Format the dateCreated column -->
        <Column field="dateCreated" header="Date Created" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.dateCreated) }}
          </template>
        </Column>
      </DataTable>
  
      <!-- Send Newsletter Button -->
      <button
        :disabled="!selectedNewsletter"
        @click="sendNewsletter"
        class="btn btn-primary mt-3"
      >
        Send Newsletter
      </button>
    </div>
  </template>
  
  
  <script setup>
import { ref, onMounted } from 'vue'
import { getNewsletters } from '@/repository/NewsletterRepository'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { getFunctions } from 'firebase/functions'

// Variables for newsletter data
const newsletters = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const sortField = ref('dateCreated')
const sortOrder = ref(1)
const currentPage = ref(0)
const selectedNewsletter = ref(null) // Holds the selected newsletter

// Firestore initialization
const db = getFirestore()

// Fetch newsletters function
const fetchNewsletters = async (page = 0, rows = 10, sortField = 'dateCreated', sortOrder = 1) => {
  loading.value = true
  try {
    const response = await getNewsletters(page, rows, sortField, sortOrder)
    newsletters.value = response.data
    totalRecords.value = response.total
  } catch (err) {
    console.error('Error fetching newsletters:', err)
  } finally {
    loading.value = false
  }
}

// Handle pagination
const onPage = (event) => {
  currentPage.value = event.page
  fetchNewsletters(event.page, event.rows, sortField.value, sortOrder.value)
}

// Handle sorting
const onSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  fetchNewsletters(currentPage.value, rowsPerPage.value, sortField.value, sortOrder.value)
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

// Function to send newsletter via Firebase Cloud Function
const sendNewsletter = async () => {
  if (!selectedNewsletter.value) return

  try {
    // Get Firebase Functions instance
    const functions = getFunctions()
    const sendNewsletterFunction = httpsCallable(functions, 'sendNewsletter')

    // Call the function and pass the selected newsletter
    const result = await sendNewsletterFunction({
      subject: selectedNewsletter.value.subject,
      body: selectedNewsletter.value.body,
      attachmentURL: selectedNewsletter.value.attachmentURL
    })

    console.log('Newsletter sent successfully:', result)
  } catch (error) {
    console.error('Error sending newsletter:', error)
  }
}

onMounted(() => {
  fetchNewsletters()
})
</script>

  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>
  