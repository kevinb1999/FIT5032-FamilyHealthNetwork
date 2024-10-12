<script setup>
import { ref, onMounted } from 'vue'
import { getClinics, deleteClinic } from '@/repository/ClinicRepository' // Import the deleteClinic method
import ClinicModal from './ClinicModal.vue' // Assuming there's a modal to edit clinics

// Define props
const props = defineProps({
  publicView: {
    type: Boolean,
    default: false
  }
})

const clinics = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10) // Number of rows per page
const currentPage = ref(0) // Current page number
const sortField = ref('')
const sortOrder = ref(1)

const showModal = ref(false) // For controlling the clinic modal
const selectedClinic = ref(null) // Store the selected clinic for editing

// Define filters for each field
const filters = ref({
  name: { value: null, matchMode: 'contains' },
  phoneNumber: { value: null, matchMode: 'contains' },
  location: { value: null, matchMode: 'contains' },
  description: { value: null, matchMode: 'contains' }
})

// Fetch clinics from the repository with pagination, sorting, and filtering
const fetchClinics = async (page = 0, rows = 10, sortField = '', sortOrder = 1, filters = {}) => {
  try {
    loading.value = true
    const response = await getClinics(page, rows, sortField, sortOrder, filters) // Fetch data from repository
    clinics.value = response.data // Assign the fetched clinic data
    totalRecords.value = response.total // Assign the total number of records
    loading.value = false
  } catch (err) {
    console.error('Error fetching clinics:', err)
    loading.value = false
  }
}

onMounted(() => {
  fetchClinics() // Fetch clinics on mount
})

// Handle pagination events
const onPage = (event) => {
  currentPage.value = event.page
  fetchClinics(event.page, event.rows, sortField.value, sortOrder.value, filters.value)
}

// Handle sorting events
const onSort = (event) => {
  fetchClinics(currentPage.value, rowsPerPage.value, event.sortField, event.sortOrder, filters.value)
}

// Handle filtering events
const onFilter = (event) => {
  filters.value = event.filters // Update filters with event filters
  fetchClinics(currentPage.value, rowsPerPage.value, sortField.value, sortOrder.value, filters.value)
}

// Handle deleting a clinic
const handleDeleteClinic = async (clinicId) => {
  try {
    await deleteClinic(clinicId) // Call the delete method from the repository
    fetchClinics(currentPage.value, rowsPerPage.value) // Refresh the clinic list after deletion
  } catch (error) {
    console.error('Error deleting clinic:', error)
  }
}
</script>


<template>
  <div>
    <!-- Clinic Data Table -->
    <DataTable
      :value="clinics"
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
    >
      <!-- Columns with built-in filters -->
      <Column
        field="name"
        header="Clinic Name"
        sortable
        filter
        filterPlaceholder="Search by name"
      />
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
      <Column
        field="description"
        header="Description"
        sortable
        filter
        filterPlaceholder="Search by description"
      />

      <!-- Conditionally show the Actions column if not public view -->
      <Column v-if="!publicView" header="Actions" bodyClass="text-center">
        <template #body="slotProps">
          <Button
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="handleDeleteClinic(slotProps.data.id)"
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


<style scoped>
.text-center {
  text-align: center;
}
</style>
