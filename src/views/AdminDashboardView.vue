<script setup>
import { ref } from 'vue'
import ArticleTable from '../components/ArticleTable.vue'
import EventTable from '@/components/EventTable.vue'
import ClinicTable from '@/components/ClinicTable.vue'
import UsersTable from '../components/UsersTable.vue'
import SiteSettings from '@/components/SiteSettings.vue'

const currentComponent = ref('ArticleTable')

function showComponent(componentName) {
  currentComponent.value = componentName
}
</script>

<template>
  <div class="admin-dashboard d-flex">
    <!-- Sidebar -->
    <div class="sidebar bg-light p-3">
      <h4>Admin Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item">
          <button class="nav-link" @click="showComponent('ArticleTable')">Articles</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" @click="showComponent('EventTable')">Events</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" @click="showComponent('ClinicTable')">Clinics</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" @click="showComponent('UsersTable')">Users</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" @click="showComponent('SiteSettings')">Site Settings</button>
        </li>
      </ul>
    </div>

    <!-- Main Content Area -->
    <div class="main-content p-3 flex-grow-1 container">
      <ArticleTable v-if="currentComponent === 'ArticleTable'" />
      <EventTable v-if="currentComponent === 'EventTable'" />
      <ClinicTable v-if="currentComponent === 'ClinicTable'" />
      <UsersTable v-if="currentComponent === 'UsersTable'" />
      <SiteSettings v-if="currentComponent === 'SiteSettings'" />
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  height: 100%;
}

.sidebar {
  width: 250px;
  min-height: 100%;
}

.main-content {
  flex-grow: 1;
}

.nav-link {
  cursor: pointer;
}

.nav-link.active {
  background-color: #e9ecef;
}
</style>
