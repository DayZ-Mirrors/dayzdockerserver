<script setup>
import { useFetch} from '@/fetch'
const { data } = useFetch('/mods')
const modId = null
</script>

<template>
  <div v-if="data">
    <h4 class="text-center">Installed Mods</h4>
    <table>
      <tr>
        <th>Steam Link</th>
        <th>Mod Info</th>
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
            <a class="simulink" @click="modId=mod.id">{{ mod.name }}</a>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>
