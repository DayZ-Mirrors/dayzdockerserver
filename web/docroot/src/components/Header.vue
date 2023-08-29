<script setup>
import Search from '@/components/Search.vue'
import Status from '@/components/Status.vue'
import Servers from '@/components/Servers.vue'
import { useFetch } from '@vueuse/core'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
const { error, data } = await useFetch('http://bubba:8000/status').get().json()
const set = (w, e) => {
  store.section = w
  const active = Array.from(document.getElementsByClassName('active'))
  active.forEach((a) => a.classList.remove('active'))
  e.target.classList.add('active')
}
</script>

<template>
  <div v-if="data" class="row">
    <div class="col-3 text-center">
      <h1>DayZ Docker Server</h1>
    </div>
    <div class="col-5">
      <button
          @click="installbase"
          :class="'btn btn-sm ' + (data.installed ? 'btn-danger' : 'btn-success')"
      >
        Install Server Files
      </button>
      <button @click="updatebase" class="btn btn-sm btn-outline-success">Update Server Files</button>
      <button @click="updatemods" class="btn btn-sm btn-outline-success">Update Mods</button>
      <button type="button" @click="set('servers', $event)" class="btn btn-sm btn-outline-primary">Servers</button>
      <button type="button" @click="set('mods', $event)" class="btn btn-sm btn-outline-primary active" data-bs-toggle="button">Mods</button>
      <button type="button" @click="set('search', $event)" class="btn btn-sm btn-outline-primary">Search</button>
    </div>
    <Search />
    <Status :status="data" />
    <Servers />
  </div>
</template>
