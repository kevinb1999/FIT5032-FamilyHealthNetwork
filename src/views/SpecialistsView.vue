<template>
  <div class="container m-5">
    <DataTable
      :value="users"
      :loading="loading"
      :rows="rowsPerPage"
      :paginator="true"
      :total-records="totalRecords"
      :lazy="true"
      @page="onPage"
      @sort="onSort"
      :sortField="sortField"
      :sortOrder="sortOrder"
      aria-label="List of specialists"
    >
      <Column
        field="firstName"
        header="First Name"
        sortable
        filter
        filterPlaceholder="Search by first name"
        aria-label="Search by first name"
      />
      <Column
        field="lastName"
        header="Last Name"
        sortable
        filter
        filterPlaceholder="Search by last name"
        aria-label="Search by last name"
      />
      <Column
        field="about"
        header="About"
        sortable
        filter
        filterPlaceholder="Search by about"
        aria-label="Search by about"
      />
      <Column
        field="email"
        header="Email"
        sortable
        filter
        filterPlaceholder="Search by email"
        aria-label="Search by email"
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
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSpecialists } from '@/repository/UserRepository'
import { getAuth } from 'firebase/auth'

const users = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const currentPage = ref(0)
const auth = getAuth()
const sortField = ref('')
const sortOrder = ref(1)

const fetchUsers = async (page = 0, rows = 10, sortField = '', sortOrder = 1) => {
  try {
    loading.value = true
    const response = await getSpecialists(page, rows, sortField, sortOrder)
    users.value = response.data
    totalRecords.value = response.total
    loading.value = false
  } catch (err) {
    console.error('Error fetching specialists:', err)
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const onPage = (event) => {
  currentPage.value = event.page
  fetchUsers(event.page, event.rows, sortField.value, sortOrder.value)
}

const onSort = (event) => {
  fetchUsers(currentPage.value, rowsPerPage.value, event.sortField, event.sortOrder)
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
.container {
  align-self: center;
}
</style>
