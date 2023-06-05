<script setup>
const searchResults = null
</script>

<template>
  <div v-if="searchResults" class="d-flex">
    <table>
      <tr>
        <th>Steam Link</th>
        <th>Title</th>
        <th>Size</th>
        <th>Last Updated</th>
        <th>Subscriptions</th>
        <th></th>
      </tr>
      <tr v-for="result in searchResults">
        <td>
          <a
              target="_blank"
              :href="steamURL + result.publishedfileid"
          >
            <img :alt="result.short_description" data-bs-toggle="tooltip" data-bs-placement="left" :title="result.short_description" width="160" height="90" :src="result.preview_url">
          </a>
        </td>
        <td>{{ result.title }}</td>
        <td>{{ BKMG(result.file_size) }}</td>
        <td>{{ new Date(result.time_updated * 1000).toLocaleDateString("en-us") }}</td>
        <td>{{ result.lifetime_subscriptions }}</td>
        <td>
          <button v-if="mods.find(o => o.id === result.publishedfileid)" @click="removeMod(result.publishedfileid)" type="button" class="btn btn-danger">Remove</button>
          <button v-else @click="installMod(result.publishedfileid)" type="button" class="btn btn-success">Install</button>
        </td>
      </tr>
    </table>
  </div>
</template>
