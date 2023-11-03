<script setup>
import { useFetch } from "@vueuse/core"
import XmlFile from '@/components/XmlFile.vue'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
import { config } from '@/config'
const { data, error } = useFetch(() => config.baseUrl + `/mod/${store.modId}`, {
  immediate: false,
  refetch: true
}).get().json()
</script>

<template>
  <div class="col-md-9 border">
    <div v-if="error" class="d-flex">Error: {{ error }}</div>
    <div v-else-if="data" class="d-flex">
      <div>
        <div>
          <strong>{{ data.name }}</strong>
        </div>
        <div>
          ID: {{ data.id }}
        </div>
        <div>
          Size: {{ data.size.toLocaleString("en-US") }}
        </div>
        <div v-if="data.customXML.length > 0">
          Custom XML files:
          <ul>
            <li v-for="info in data.customXML">
              <a
                :class="'simulink xmlfile ' + (store.modFile === info.name ? 'active' : '')"
                @click="store.modFile=info.name"
              >
                {{ info.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-1"></div>
      <div>
        <XmlFile />
      </div>
    </div>
  </div>
</template>
