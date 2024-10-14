import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // The logged-in user data from Firestore
    userType: null // The role or type of the user
  }),
  getters: {
    isAdmin: (state) => state.userType === 'admin',
    isStaff: (state) => state.userType === 'staff',
    isPractitioner: (state) => state.userType === 'practitioner'
  },
  actions: {
    setUser(user) {
      this.user = user
      this.userType = user.userType // Assuming userType comes from Firestore
    },
    clearUser() {
      this.user = null
      this.userType = null
    }
  }
})
