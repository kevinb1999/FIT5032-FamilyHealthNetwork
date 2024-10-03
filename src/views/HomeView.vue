<script setup></script>

<template>
  <div class="container mt-5">
    <!-- Carousel -->
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div
            class="d-block w-100 bg-dark text-white d-flex justify-content-center align-items-center"
            style="height: 400px"
          >
            <h2>Slide 1</h2>
          </div>
        </div>
        <div class="carousel-item">
          <div
            class="d-block w-100 bg-secondary text-white d-flex justify-content-center align-items-center"
            style="height: 400px"
          >
            <h2>Slide 2</h2>
          </div>
        </div>
        <div class="carousel-item">
          <div
            class="d-block w-100 bg-dark text-white d-flex justify-content-center align-items-center"
            style="height: 400px"
          >
            <h2>Slide 3</h2>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Marketing messaging and featurettes -->
    <div class="container marketing mt-5">
      <!-- Featurettes -->
      <hr class="featurette-divider" />

      <div class="row featurette">
        <div class="col-md-7">
          <h2 class="featurette-heading">
            First featurette heading. <span class="text-muted">It'll blow your mind.</span>
          </h2>
          <p class="lead">Some great placeholder content to fill up this space.</p>
        </div>
        <div class="col-md-5">
          <div
            class="bg-dark text-white d-flex justify-content-center align-items-center"
            style="height: 300px"
          >
            <h3>500x500</h3>
          </div>
        </div>
      </div>

      <hr class="featurette-divider" />

      <div class="row featurette">
        <div class="col-md-7 order-md-2">
          <h2 class="featurette-heading">
            Oh yeah, it's that good. <span class="text-muted">See for yourself.</span>
          </h2>
          <p class="lead">Another exciting bit of placeholder content.</p>
        </div>
        <div class="col-md-5 order-md-1">
          <div
            class="bg-secondary text-white d-flex justify-content-center align-items-center"
            style="height: 300px"
          >
            <h3>500x500</h3>
          </div>
        </div>
      </div>

      <hr class="featurette-divider" />

      <div class="row featurette">
        <div class="col-md-7">
          <h2 class="featurette-heading">
            And lastly, this one. <span class="text-muted">Checkmate.</span>
          </h2>
          <p class="lead">More amazing placeholder content for this featurette.</p>
        </div>
        <div class="col-md-5">
          <div
            class="bg-dark text-white d-flex justify-content-center align-items-center"
            style="height: 300px"
          >
            <h3>500x500</h3>
          </div>
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
