<template>
  <h1>Hello App!</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink :to="{ name: 'CreateTrip' }" >create</RouterLink>
    <RouterLink :to="{ name: 'TripDetails' }" >details</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

onMounted(() => {
  router.push(window.location.pathname)
})
</script>

<style scoped></style>
