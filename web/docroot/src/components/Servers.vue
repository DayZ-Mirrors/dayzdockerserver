<script setup>
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
</script>

<template>
  <div class="row" v-if="store.section === 'servers'">
    <div class="col text-center">
      <div class="row">
        <div class="col">
          <h2>Servers</h2>
        </div>
      </div>
      <div class="row flex-grow-1">
        <div class="col-6 justify-content-end">Running</div>
        <div class="col-6">Stopped</div>
      </div>
    </div>
  </div>
</template>
