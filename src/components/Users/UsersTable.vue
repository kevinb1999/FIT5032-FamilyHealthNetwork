<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, deleteUser } from '@/repository/UserRepository' // Import deleteUser method
import { getAuth, deleteUser as deleteAuthUser } from 'firebase/auth'

const users = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10) // Number of rows per page
const currentPage = ref(0) // Current page number
const auth = getAuth() // Firebase Auth
const sortField = ref('')
const sortOrder = ref(1)

// Fetch users from the repository with pagination and sorting
const fetchUsers = async (page = 0, rows = 10, sortField = '', sortOrder = 1) => {
  try {
    loading.value = true
    const response = await getUsers(page, rows, sortField, sortOrder) // Update to use the repository
    users.value = response.data // Assign the fetched user data
    totalRecords.value = response.total // Assign the total number of records
    loading.value = false
  } catch (err) {
    console.error('Error fetching users:', err)
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers() // Fetch users on mount
})

// Handle pagination events
const onPage = (event) => {
  currentPage.value = event.page
  fetchUsers(event.page, event.rows, event.sortField, event.sortOrder)
}

// Handle sorting events
const onSort = (event) => {
  fetchUsers(currentPage.value, rowsPerPage.value, event.sortField, event.sortOrder)
}

// Delete a user from Firestore and Firebase Auth
const handleDeleteUser = async (userId, authUid) => {
  try {
    // Delete the user from Firestore
    await deleteUser(userId)

    // Delete the user from Firebase Authentication
    const userToDelete = auth.currentUser // Assuming admin rights
    if (userToDelete && userToDelete.uid === authUid) {
      await deleteAuthUser(userToDelete)
    }

    // Refetch users after deletion
    fetchUsers(currentPage.value, rowsPerPage.value)

    console.log(`User ${userId} deleted successfully`)
  } catch (err) {
    console.error('Error deleting user:', err)
  }
}
</script>

<template>
  <div>
    <!-- User Data Table -->
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
      :filters="filters"
    >
      <!-- Columns with built-in filters -->
      <Column field="email" header="Email" sortable filter filterPlaceholder="Search by email" />
      <Column
        field="firstName"
        header="First Name"
        sortable
        filter
        filterPlaceholder="Search by first name"
      />
      <Column
        field="lastName"
        header="Last Name"
        sortable
        filter
        filterPlaceholder="Search by last name"
      />
      <Column
        field="phoneNumber"
        header="Phone Number"
        sortable
        filter
        filterPlaceholder="Search by phone number"
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
