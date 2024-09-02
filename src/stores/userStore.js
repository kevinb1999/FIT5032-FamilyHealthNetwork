import { defineStore } from 'pinia'
import { users } from '@/repository/UserRepository'

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
