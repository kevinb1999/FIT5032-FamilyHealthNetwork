<script setup>
import ProfileButton from './ProfileButton.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img
          alt="Vue logo"
          class="d-inline-block align-top"
          src="@/assets/logo.svg"
          width="30"
          height="30"
        />
        <span class="ml-2">Family Health Network</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/education" active-class="active-nav-link"
              >Education</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/locations-services" active-class="active-nav-link"
              >Locations and Services</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/clinics-specialists" active-class="active-nav-link"
              >Clinics and Specialists</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact-us" active-class="active-nav-link"
              >Contact Us</router-link
            >
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <router-link v-if="!userStore.user" to="/login" class="btn btn-login navbar-text me-2">
            Login
          </router-link>
          <router-link v-if="!userStore.user" to="/signup" class="btn btn-signup navbar-text">
            Sign Up
          </router-link>
          <div v-if="userStore.user" class="d-flex align-items-center">
            <ProfileButton />
          </div>
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
.custom-navbar {
  background-color: #40e0d0;
}
.navbar-brand {
  color: #003d34;
}

.navbar-nav .nav-link {
  color: #003d34;
}

.navbar-nav .nav-link.active-nav-link {
  color: #fff;
  background-color: #005f50;
  border-radius: 5%;
}

.navbar-nav .nav-link:hover {
  color: #fff;
  background-color: #003d30;
  border-radius: 5%;
}

.btn-login {
  background-color: rgb(2, 109, 43);
  border-color: #003d34;
  color: #fff;
}

.btn-login:hover {
  background-color: rgb(28, 57, 90);
  border-color: #004d40;
  color: #fff;
}

.btn-signup {
  background-color: #003d30;
  border-color: #003d34;
  color: #fff;
}

.btn-signup:hover {
  background-color: rgb(28, 57, 90);
  color: #fff;
  border-color: #003d34;
}
</style>
