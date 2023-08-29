<script setup>
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
</script>

<template>
  <div class="col form-control-lg text-center">
    <form @submit.prevent="(e) => {store.searchText=e.target.search.value; store.section='search'}">
      <input name="search" placeholder="Search mods..." autofocus>
    </form>
  </div>
</template>
