<script setup></script>

<template>
  <div class="container mt-5">
    <div class="container marketing mt-5">
      <!-- Featurettes -->
      <hr class="featurette-divider" />

      <!-- Education Featurette -->
      <div class="row featurette">
        <div class="col-md-7">
          <h2 class="featurette-heading">
            Education <span class="text-muted">Empower Yourself with Knowledge</span>
          </h2>
          <p class="lead">
            Our educational resources cover topics like contraception, family planning, sexual health, and more to help you make informed decisions about your reproductive health.
          </p>
          <a href="/education" class="btn btn-primary">Learn More</a>
        </div>
        <div class="col-md-5">
          <img src="@/assets/carosel1.jpg" class="img-fluid" alt="Education" style="height: 300px;" />
        </div>
      </div>

      <hr class="featurette-divider" />

      <!-- Locations and Services Featurette -->
      <div class="row featurette">
        <div class="col-md-7 order-md-2">
          <h2 class="featurette-heading">
            Locations and Services <span class="text-muted">Find the Support You Need</span>
          </h2>
          <p class="lead">
            Explore local clinics, reproductive health services, and get directions to nearby facilities offering help and support.
          </p>
          <a href="/locations-services" class="btn btn-primary">Find Locations</a>
        </div>
        <div class="col-md-5 order-md-1">
          <img src="@/assets/carosel3.jpg" class="img-fluid" alt="Locations & Services" style="height: 300px;" />
        </div>
      </div>

      <hr class="featurette-divider" />

      <!-- Clinics and Specialists Featurette -->
      <div class="row featurette">
        <div class="col-md-7">
          <h2 class="featurette-heading">
            Clinics and Specialists <span class="text-muted">Expert Care at Your Fingertips</span>
          </h2>
          <p class="lead">
            Search for reproductive health clinics and specialists who can guide you through your healthcare journey.
          </p>
          <a href="/clinics" class="btn btn-primary">Clinics</a>
          <a href="/specialists" class="btn btn-primary ml-2">Specialists</a>
        </div>
        <div class="col-md-5">
          <img src="@/assets/carosel2.jpg" class="img-fluid" alt="Clinics & Specialists" style="height: 300px;" />
        </div>
      </div>

      <hr class="featurette-divider" />
    </div>
  </div>
</template>

<style scoped>
h1,
h2,
.featurette-heading {
  text-align: center;
}
</style>
