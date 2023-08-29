<script setup>
import { config } from '@/config'
import { BKMG } from '@/util'
import { useFetch} from '@vueuse/core'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
const { data: searchResults, error, isFetching } = useFetch(() => `http://bubba:8000/search/${store.searchText}`, {
  immediate: false,
  refetch: true,
  afterFetch(response) {
    // const sortField = "time_updated"
    const sortField = "lifetime_subscriptions"
    response.data.response.publishedfiledetails.sort((a, b) =>
        a[sortField] < b[sortField] ? 1 : -1
    )
    return response
  }
}).get().json()
</script>

<template>
  <div v-if="store.section === 'search'">
    <div v-if="error" class="row text-danger">
      {{ error }}
    </div>
    <div v-if="store.searchText === ''">
      <div class="row justify-content-center">
        <div class="col-4">
          <h2>Search for something...</h2>
        </div>
      </div>
    </div>
    <div v-if="isFetching" class="row justify-content-center">
      <div class="col-1 text-end">
        <div class="spinner-border" role="status"></div>
      </div>
      <div class="col-4">
        <h2>Searching for <strong>"{{ store.searchText }}"...</strong></h2>
      </div>
    </div>
    <template v-if="searchResults && ! isFetching">
      <div class="text-center">
        <h2>{{ searchResults.response.total }} results for <strong>"{{ store.searchText }}"</strong></h2>
      </div>
      <div class="d-flex">
        <table>
          <tr>
            <th>Steam Link</th>
            <th>Title</th>
            <th>Size</th>
            <th>Last Updated</th>
            <th>Subscriptions</th>
            <th></th>
          </tr>
          <tr v-for="result in searchResults.response.publishedfiledetails">
            <td>
              <a
                  target="_blank"
                  :href="config.steamUrl + result.publishedfileid"
              >
                <img :alt="result.short_description" data-bs-toggle="tooltip" data-bs-placement="left" :title="result.short_description" width="160" height="90" :src="result.preview_url">
              </a>
            </td>
            <td>{{ result.title }}</td>
            <td>{{ BKMG(result.file_size) }}</td>
            <td>{{ new Date(result.time_updated * 1000).toLocaleDateString("en-us") }}</td>
            <td>{{ result.lifetime_subscriptions }}</td>
            <td>
              <button v-if="store.mods.find(o => o.id === result.publishedfileid)" @click="removeMod(result.publishedfileid)" type="button" class="btn btn-danger">Remove</button>
              <button v-else @click="installMod(result.publishedfileid)" type="button" class="btn btn-success">Install</button>
            </td>
          </tr>
        </table>
      </div>
    </template>
  </div>
</template>
