<script setup>
import { ref, computed } from 'vue'
import xmltree from '@/components/XmlTree.vue'
import { useFetch} from '@/fetch'
const modId = ref(null)
const modInfo = null
const xmlInfo = null
const url = computed(() => baseUrl + '/mod/' + modId.value)
const { data } = useFetch(url)
</script>
<template>
  <div class="col-md-9 border">
    <div class="d-flex" v-if="data">
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
                  @click="modInfo=nfo.name"
              >
                {{ info.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-1"></div>
      <div>
        <xmltree v-if="xmlInfo" :xmlData="xmlInfo" />
      </div>
    </div>
  </div>
</template>
