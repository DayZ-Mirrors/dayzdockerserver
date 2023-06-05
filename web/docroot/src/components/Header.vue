<script setup>
import Search from '@/components/Search.vue'
import { useFetch } from '@/fetch.js'
const { data, error } = useFetch('/status')
</script>
<template>
  <div v-if="! error && data" class="row">
    <div class="col-3 text-center">
      <h1>DayZ Docker Server</h1>
    </div>
    <div class="col-5">
      <button
          @click="installbase"
          :class="'btn ' + (data.installed ? 'btn-danger' : 'btn-success')"
      >
        Install Server Files
      </button>
      <button @click="updatebase" class="btn btn-success">Update Server Files</button>
      <button @click="updatemods" class="btn btn-success">Update Mods</button>
      <button @click="servers" class="btn btn-primary">Servers</button>
      <button @click="listmods" class="btn btn-primary">Mods</button>
    </div>
    <Search />
    <div class="col">
      <div>
        Server files installed:
        <span class="bi bi-check h2 text-success" v-if="data.installed"></span>
        <span class="bi bi-x h2 danger text-danger" v-else></span>
      </div>
      <div v-if="data.version !== ''">
        Version: <span class="text-success font-weight-bold">{{ data.version }}</span>
      </div>
    </div>
  </div>
</template>
