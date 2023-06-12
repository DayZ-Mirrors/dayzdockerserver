<script setup>
import { useFetch} from '@vueuse/core'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
const { data, error } = await useFetch('http://bubba:8000/mods').get().json()
</script>

<template>
  <div class="col-md-3 border">
    <div v-if="data">
      <h4 class="text-center">Installed Mods</h4>
      <table>
        <tr>
          <th>Steam Link</th>
          <th>Mod Name</th>
        </tr>
        <template
            v-for="mod in data.mods"
        >
          <tr>
            <td>
              <a
                  target="_blank"
                  :href="steamUrl + mod.id"
              >
                {{ mod.id }}
              </a>
            </td>
            <td>
              <a class="simulink" @click="store.modId=parseInt(mod.id)">{{ mod.name }}</a>
            </td>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>
