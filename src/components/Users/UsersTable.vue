<template>
  <div>
    <DataTable
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      removableSort
      :value="users"
      :loading="loading"
      :total-records="totalRecords"
      aria-label="List of users"
    >
      <Column
        field="email"
        header="Email"
        sortable
        filter
        filterPlaceholder="Search by email"
        aria-label="Search by email"
      />
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
        field="phoneNumber"
        header="Phone Number"
        sortable
        filter
        filterPlaceholder="Search by phone number"
        aria-label="Search by phone number"
      />
      <Column header="Actions" bodyClass="text-center">
        <template #body="slotProps">
          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-warning mr-2"
              @click="handleEditUser(slotProps.data)"
              aria-label="Edit user {{ slotProps.data.email }}"
            >
              <i class="pi pi-pencil" aria-hidden="true"></i> Edit
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDeleteUser(slotProps.data.id, slotProps.data.authUid)"
              aria-label="Delete user {{ slotProps.data.email }}"
            >
              <i class="pi pi-trash" aria-hidden="true"></i> Delete
            </button>
          </div>
        </template>
      </Column>
    </DataTable>

    <UserModal
      v-if="selectedUser"
      :userData="selectedUser"
      :showModal="showModal"
      @close="closeModal"
      @refreshTable="fetchData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, deleteUser } from '@/repository/UserRepository'
import { getAuth, deleteUser as deleteAuthUser } from 'firebase/auth'
import UserModal from '@/components/Users/UserModal.vue'

const users = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const showModal = ref(false)
const selectedUser = ref(null)

const auth = getAuth()

function fetchData() {
  loading.value = true
  getUsers()
    .then((response) => {
      users.value = response.data
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

const handleDeleteUser = async (userId, authUid) => {
  try {
    await deleteUser(userId)
    const userToDelete = auth.currentUser
    if (userToDelete && userToDelete.uid === authUid) {
      await deleteAuthUser(userToDelete)
    }
    fetchData()
  } catch (err) {
    console.error('Error deleting user:', err)
  }
}

const handleEditUser = (user) => {
  selectedUser.value = user
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
}

defineExpose({ fetchData }) // Ensure fetchData is defined for exposure
</script>

<style scoped>
.text-center {
  text-align: center;
}
.d-flex {
  display: flex;
}
.justify-content-center {
  justify-content: center;
}
</style>
