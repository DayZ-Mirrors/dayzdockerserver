<script setup>
import Search from '@/components/Search.vue'
import Status from '@/components/Status.vue'
import { useFetch } from '@vueuse/core'
const { error, data: status } = await useFetch('http://bubba:8000/status').get().json()
</script>

<template>
  <div v-if="status" class="row">
    <div class="col-3 text-center">
      <h1>DayZ Docker Server</h1>
    </div>
    <div class="col-5">
      <button
          @click="installbase"
          :class="'btn btn-sm ' + (status.installed ? 'btn-danger' : 'btn-success')"
      >
        Install Server Files
      </button>
      <button @click="updatebase" class="btn btn-sm btn-success">Update Server Files</button>
      <button @click="updatemods" class="btn btn-sm btn-success">Update Mods</button>
      <button @click="servers" class="btn btn-sm btn-primary">Servers</button>
      <button @click="listmods" class="btn btn-sm btn-primary">Mods</button>
    </div>
    <Search />
    <Status :status="status" />
  </div>
</template>
