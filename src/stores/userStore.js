import { defineStore } from 'pinia'
import { ref } from 'vue'

const users = ref([
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
])

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // User object with role and permissions
    userType: null
  }),
  getters: {
    isAdmin: (state) => state.user?.userType === 'admin',
    isStaff: (state) => state.user?.userType === 'staff',
    isPractitioner: (state) => state.user?.userType === 'practitioner'
    // Add other role checks as needed
  },
  actions: {
    setUser(user) {
      this.user = user
      const tmpDbUser = users.value.find((dbUser) => dbUser.id === user?.uid)
      this.userType = tmpDbUser?.userType
    },
    clearUser() {
      this.user = null
      this.userType = null
    }
  }
})
