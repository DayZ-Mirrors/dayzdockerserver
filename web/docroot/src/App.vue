<script setup>
import Body from '@/components/Body.vue'
import Error from '@/components/Error.vue'
import Header from '@/components/Header.vue'
</script>

<template>
  <Error />
  <div class="container-fluid min-vh-100 d-flex flex-column bg-light">
    <Header />
    <Body />
  </div>
</template>
