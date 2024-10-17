<template>
  <div class="admin-dashboard d-flex">
    <!-- Sidebar -->
    <nav class="sidebar bg-light p-3" aria-label="Admin Dashboard Navigation">
      <h4>Admin Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'ClinicTable' }"
            @click="showComponent('ClinicTable')"
            aria-pressed="currentComponent === 'ClinicTable'"
          >
            Clinics
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'ArticleTable' }"
            @click="showComponent('ArticleTable')"
            aria-pressed="currentComponent === 'ArticleTable'"
          >
            Articles
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'EventTable' }"
            @click="showComponent('EventTable')"
            aria-pressed="currentComponent === 'EventTable'"
          >
            Events
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'NewsletterTable' }"
            @click="showComponent('NewsletterTable')"
            aria-pressed="currentComponent === 'NewsletterTable'"
          >
            Newsletters
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'UsersTable' }"
            @click="showComponent('UsersTable')"
            aria-pressed="currentComponent === 'UsersTable'"
          >
            Users
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentComponent === 'ExportData' }"
            @click="showComponent('ExportData')"
            aria-pressed="currentComponent === 'ExportData'"
          >
            Export Data
          </button>
        </li>
      </ul>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content p-3 flex-grow-1 container" role="main">
      <!-- Add New Buttons -->
      <button
        v-if="currentComponent === 'ClinicTable'"
        class="btn btn-primary mb-3"
        @click="handleAddNewClinic"
        aria-label="Add new clinic"
      >
        Add Clinic
      </button>
      <button
        v-if="currentComponent === 'ArticleTable'"
        class="btn btn-primary mb-3"
        @click="handleAddNewArticle"
        aria-label="Add new article"
      >
        Add Article
      </button>
      <button
        v-if="currentComponent === 'EventTable'"
        class="btn btn-primary mb-3"
        @click="handleAddNewEvent"
        aria-label="Add new event"
      >
        Add Event
      </button>
      <button
        v-if="currentComponent === 'NewsletterTable'"
        class="btn btn-primary mb-3"
        @click="handleAddNewNewsletter"
        aria-label="Add new newsletter"
      >
        Add Newsletter
      </button>

      <!-- Modals -->
      <ClinicModal
        v-if="currentComponent === 'ClinicTable'"
        :clinicData="selectedClinic"
        :showModal="showModal"
        @close="closeModal"
        @refreshTable="refreshTable"
      />
      <ArticleModal
        v-if="currentComponent === 'ArticleTable'"
        :articleData="selectedArticle"
        :showModal="showModal"
        @close="closeModal"
        @refreshTable="refreshTable"
      />
      <EventModal
        v-if="currentComponent === 'EventTable'"
        :eventData="selectedEvent"
        :showModal="showModal"
        @close="closeModal"
        @refreshTable="refreshTable"
      />
      <NewsletterModal
        v-if="currentComponent === 'NewsletterTable'"
        :newsletterData="selectedNewsletter"
        :showModal="showModal"
        @close="closeModal"
        @refreshTable="refreshTable"
      />

      <!-- Tables -->
      <ClinicTable
        v-if="currentComponent === 'ClinicTable'"
        ref="clinicTableRef"
        @edit="handleEditClinic"
      />
      <ArticleTable
        v-if="currentComponent === 'ArticleTable'"
        ref="articleTableRef"
        @edit="handleEditArticle"
      />
      <EventTable
        v-if="currentComponent === 'EventTable'"
        ref="eventTableRef"
        @edit="handleEditEvent"
      />
      <NewsletterTable
        v-if="currentComponent === 'NewsletterTable'"
        ref="newsletterTableRef"
        @edit="handleEditNewsletter"
      />
      <UsersTable
        v-if="currentComponent === 'UsersTable'"
        ref="usersTableRef"
        @edit="handleEditUser"
      />
      <ExportData v-if="currentComponent === 'ExportData'" ref="exportDataRef" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Import tables and modals
import ClinicTable from '@/components/Clinics/ClinicTable.vue'
import ArticleTable from '@/components/Education/ArticleTable.vue'
import EventTable from '@/components/Education/EventTable.vue'
import NewsletterTable from '@/components/Newsletter/NewsletterTable.vue'
import UsersTable from '@/components/Users/UsersTable.vue'

import ClinicModal from '@/components/Clinics/ClinicModal.vue'
import ArticleModal from '@/components/Education/ArticleModal.vue'
import EventModal from '@/components/Education/EventModal.vue'
import NewsletterModal from '@/components/Newsletter/NewsletterModal.vue'
import UserModal from '@/components/Users/UserModal.vue'

import ExportData from '@/components/ExportData.vue'

// Reactive variables for component management
const currentComponent = ref('ClinicTable')
const showModal = ref(false)
const selectedClinic = ref(null)
const selectedArticle = ref(null)
const selectedEvent = ref(null)
const selectedNewsletter = ref(null)
const selectedUser = ref(null)

// Refs for table components
const clinicTableRef = ref(null)
const articleTableRef = ref(null)
const eventTableRef = ref(null)
const newsletterTableRef = ref(null)
const usersTableRef = ref(null)
const exportDataRef = ref(null)

// Mapping of component names to refs
const tableRefs = {
  ClinicTable: clinicTableRef,
  ArticleTable: articleTableRef,
  EventTable: eventTableRef,
  NewsletterTable: newsletterTableRef,
  UsersTable: usersTableRef,
  exportData: exportDataRef
}

// Function to get the active table component instance
function getActiveTableComponent() {
  return tableRefs[currentComponent.value]?.value || null
}

// Function to refresh the data in the active table
function refreshTable() {
  const activeTableComponent = getActiveTableComponent()
  if (activeTableComponent && typeof activeTableComponent.fetchData === 'function') {
    activeTableComponent.fetchData()
  }
}

// Function to switch components
function showComponent(componentName) {
  currentComponent.value = componentName
}

// Functions to handle adding new items
function handleAddNewClinic() {
  selectedClinic.value = null
  showModal.value = true
}

function handleAddNewArticle() {
  selectedArticle.value = null
  showModal.value = true
}

function handleAddNewEvent() {
  selectedEvent.value = null
  showModal.value = true
}

function handleAddNewNewsletter() {
  selectedNewsletter.value = null
  showModal.value = true
}

// Functions to handle editing items
function handleEditClinic(clinic) {
  selectedClinic.value = clinic
  showModal.value = true
}

function handleEditArticle(article) {
  selectedArticle.value = article
  showModal.value = true
}

function handleEditEvent(event) {
  selectedEvent.value = event
  showModal.value = true
}

function handleEditNewsletter(newsletter) {
  selectedNewsletter.value = newsletter
  showModal.value = true
}

function handleEditUser(user) {
  selectedUser.value = user
  showModal.value = true
}

// Function to close the modal
function closeModal() {
  showModal.value = false
}
</script>

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
