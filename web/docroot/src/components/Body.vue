<script setup>
import Mods from '@/components/Mods.vue'
import ModInfo from '@/components/Modinfo.vue'
import SearchResults from "@/components/SearchResults.vue";
</script>

<template>
  <div class="row flex-grow-1">
    <Mods />
    <ModInfo />
    <SearchResults />
  </div>
</template>
