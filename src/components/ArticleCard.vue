<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div
    class="card"
    style="width: 100%; border: 1px solid #007bff; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)"
  >
    <div class="card-header text-white" style="background-color: #007bff">
      <h5 class="card-title mb-0">{{ title }}</h5>
    </div>
    <div
      class="card-img-top"
      style="
        background-color: #000;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      "
    >
      <!-- <img
        :src="image"
        alt="Article Image"
        style="max-height: 100%; max-width: 100%; object-fit: cover"
      /> -->
    </div>
    <div class="card-body">
      <p class="card-text">
        {{ description }}
      </p>
    </div>
    <div class="card-footer bg-light d-flex justify-content-start">
      <span class="text-warning">
        <i class="fas fa-star" v-for="n in rating" :key="'filled-' + n"></i>
        <i class="far fa-star" v-for="n in 5 - rating" :key="'empty-' + n"></i>
      </span>
    </div>
  </div>
</template>

<style scoped></style>
