// This will be replaced by a firebase database in the near future
import { ref } from 'vue'

export const users = ref([])

export const addUser = (newUser) => {
  users.value.push(newUser)
  localStorage.setItem('users', JSON.stringify(users.value))
}

export const editUser = (updatedUser) => {
  const index = users.value.findIndex((user) => user.id === updatedUser.id)
  users.value[index] = updatedUser
  localStorage.setItem('users', JSON.stringify(users.value))
}

export const deleteUser = (id) => {
  users.value = users.value.filter((user) => user.id !== id)
  localStorage.setItem('users', JSON.stringify(users.value))
}

export const loadUsers = () => {
  const savedUsers = localStorage.getItem('users')
  if (savedUsers) {
    users.value = JSON.parse(savedUsers)
  } else {
    // Load default users if nothing is in local storage
    users.value = [
      {
        id: 'AP2128lw0XPXgmyHlppGHWExY662',
        email: 'admin@fhn.org',
        userType: 'admin'
      },
      {
        id: 'jkKzzdoin2ast7cr8PLxFzs9dn72',
        email: 'staff@fhn.org',
        userType: 'staff'
      },
      {
        id: 'AP2128lw0XPXgmyHlppGHWExY662',
        email: 'user@example.org',
        userType: 'user'
      }
    ]
  }
}

export default {
  users,
  loadUsers,
  addUser,
  editUser,
  deleteUser
}
