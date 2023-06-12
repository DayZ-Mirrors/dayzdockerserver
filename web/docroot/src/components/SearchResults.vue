<script setup>
import { useFetch} from '@vueuse/core'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
const { data: searchResults, error } = useFetch(() => `http://bubba:8000/search/${store.searchText}`, {
  immediate: false,
  refetch: true
}).get().json()
</script>

<script>
export default {
  name: "SearchResults",
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      fetch(this.apihost + '/search/' + e.target.search.value)
          .then(response => response.json())
          .then(response => {
            this.modInfo = ""
            this.XMLInfo = ""
            // const sortField = "time_updated"
            const sortField = "lifetime_subscriptions"
            response.response.publishedfiledetails.sort((a, b) =>
                a[sortField] < b[sortField] ? 1 : -1
            )
            this.searchResults = response.response.publishedfiledetails
          })
          .then(() => {
            // Enable all tooltips
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.map(function (tooltipTriggerEl) {
              return new bootstrap.Tooltip(tooltipTriggerEl)
            })
            // Enable all alerts
            // $('.alert').alert()
          })
          .catch((error) => {
            console.error(error)
            this.fetchError = error.message
          })
    },
  }
}
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
