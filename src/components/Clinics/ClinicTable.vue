<template>
  <div>
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
      aria-label="List of clinics"
    >
      <Column
        field="name"
        header="Clinic Name"
        sortable
        filter
        filterPlaceholder="Search by name"
        aria-label="Search by clinic name"
      />
      <Column
        field="phoneNumber"
        header="Phone Number"
        sortable
        filter
        filterPlaceholder="Search by phone number"
        aria-label="Search by phone number"
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
      <Column header="Actions" bodyClass="text-center" v-if="!isPublic">
        <template #body="slotProps">
          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-warning me-2"
              @click="$emit('edit', slotProps.data)"
              aria-label="Edit clinic {{ slotProps.data.name }}"
            >
              <i class="pi pi-pencil" aria-hidden="true"></i> Edit
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDeleteClinic(slotProps.data.id)"
              aria-label="Delete clinic {{ slotProps.data.name }}"
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
import { getClinics, deleteClinic } from '@/repository/ClinicRepository'

// Define props
const props = defineProps({
  isPublic: {
    type: Boolean,
    default: false
  }
})

const clinics = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const currentPage = ref(0)
const sortField = ref('')
const sortOrder = ref(1)

function fetchData() {
  loading.value = true
  getClinics(currentPage.value, rowsPerPage.value, sortField.value, sortOrder.value)
    .then((response) => {
      clinics.value = response.data
      totalRecords.value = response.total
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

onMounted(() => {
  fetchData()
})

const onPage = (event) => {
  currentPage.value = event.page
  fetchData()
}

const onSort = (event) => {
  fetchData()
}

const handleDeleteClinic = async (clinicId) => {
  try {
    await deleteClinic(clinicId)
    fetchData()
  } catch (error) {
    console.error('Error deleting clinic:', error)
  }
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
.me-2 {
  margin-right: 0.5rem; /* Small gap between buttons */
}
</style>
