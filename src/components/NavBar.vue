<template>
<nav class="navbar navbar-expand-lg sticky-top bg-primary" data-bs-theme="dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">
        <img alt="Vue logo" class="d-inline-block align-top" src="@/assets/logo.svg" width="30" height="30" />
        <span class="ml-2">Family Health Network</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
            <router-link class="nav-link" to="/education">Education</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" to="/locations-services">Locations and Services</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" to="/clinics-specialists">Clinics and Specialists</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" to="/contact-us">Contact Us</router-link>
            </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
            <router-link to="/login" class="btn btn-outline-success my-2 my-sm-0 navbar-text">
            Login
            </router-link>
        </form>
        </div>
    </div>
</nav>
</template>

<script setup>
</script>