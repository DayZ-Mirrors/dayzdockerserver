<script setup>
const { status } = defineProps(['status'])
</script>

<template>
  <div class="col">
    <div>
      Server files installed:
      <span v-if="status.installed" class="bi bi-check h2 text-success"></span>
      <span v-else class="bi bi-x h2 danger text-danger"></span>
    </div>
    <div v-if="status.version">
      Version: <span class="text-success fw-bold">{{ status.version }}</span>
      <span class="text-success fw-bold">({{ status.appid }})</span>
    </div>
  </div>
</template>
