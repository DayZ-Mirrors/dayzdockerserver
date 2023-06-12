<script setup>
import { useFetch } from "@vueuse/core"
import xmlTree from '@/components/XmlTree.vue'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
const { data, error } = useFetch(() => `http://bubba:8000/mod/${store.modId}`, {
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
                :class="'simulink xmlfile ' + info.name"
                @click="store.modFile=info.name"
              >
                {{ info.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-1"></div>
      <div v-if="store.modFile">
        <xml-tree :file="store.modFile" :mod-id="store.modId" />
      </div>
    </div>
  </div>
</template>
