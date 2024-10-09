<script setup>
import { ref } from 'vue'
import ArticleTable from '@/components/Education/ArticleTable.vue'
import EventTable from '@/components/Education/EventTable.vue'
import ClinicTable from '@/components/Clinics/ClinicTable.vue'
import UsersTable from '@/components/Users/UsersTable.vue'
import ArticleModal from '@/components/Education/ArticleModal.vue'
import EventModal from '@/components/Education/EventModal.vue'
import ClinicModal from '@/components/Clinics/ClinicModal.vue'
import ExportData from '@/components/ExportData.vue'

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
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'ArticleTable' }"
            @click="showComponent('ArticleTable')"
          >
            Articles
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'EventTable' }"
            @click="showComponent('EventTable')"
          >
            Events
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'ClinicTable' }"
            @click="showComponent('ClinicTable')"
          >
            Clinics
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'UsersTable' }"
            @click="showComponent('UsersTable')"
          >
            Users
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'ExportData' }"
            @click="showComponent('ExportData')"
          >
            Export Data
          </button>
        </li>
      </ul>
    </div>

    <!-- Main Content Area -->
    <div class="main-content p-3 flex-grow-1 container">
      <ArticleModal class="mb-3" v-if="currentComponent === 'ArticleTable'" />
      <ArticleTable v-if="currentComponent === 'ArticleTable'" />
      <EventModal class="mb-3" v-if="currentComponent === 'EventTable'" />
      <EventTable v-if="currentComponent === 'EventTable'" />
      <ClinicModal class="mb-3" v-if="currentComponent === 'ClinicTable'" />
      <ClinicTable v-if="currentComponent === 'ClinicTable'" />
      <UsersTable v-if="currentComponent === 'UsersTable'" />
      <ExportData v-if="currentComponent === 'ExportData'" />
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
  background-color: #f8f9fa;
  border: none;
  padding: 10px;
  width: 100%;
  text-align: left;
}

.nav-link:hover {
  background-color: #e9ecef;
}

.nav-link.active {
  background-color: #dee2e6;
  font-weight: bold;
}
</style>
