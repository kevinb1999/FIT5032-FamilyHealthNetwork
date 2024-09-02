<script setup>
import { users, deleteUser, editUser } from '@/repository/UserRepository.js'

// Method to handle user deletion
const handleDeleteUser = (userId) => {
  if (confirm('Are you sure you want to delete this user?')) {
    deleteUser(userId)
  }
}
</script>

<template>
  <div>
    <h3>Users</h3>
    <!-- User list or content goes here -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="email-column">{{ user.email }}</td>
          <td class="role-column">{{ user.userType }}</td>
          <td class="action-column">
            <!-- Role Dropdown -->
            <label for="roleSelect" class="form-label me-1 mb-0">Role:</label>
            <select
              class="form-select form-select-sm"
              v-model="user.userType"
              @change="editUser(user)"
              data-bs-toggle="tooltip"
              title="Change Role"
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="practitioner">Practitioner</option>
              <option value="admin">Admin</option>
            </select>
            <!-- Delete Button -->
            <button
              class="btn btn-sm btn-danger ms-3"
              @click="handleDeleteUser(user.id)"
              data-bs-toggle="tooltip"
              title="Delete User"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.email-column {
  width: 100%;
}
.role-column {
  min-width: 8rem;
}
.form-select {
  width: auto;
}
.action-column {
  display: flex;
  align-items: center;
}
</style>
