<!--<script setup>-->
<!--import { ref, computed } from 'vue'-->
<!--import { useFetch} from '@/fetch'-->
<!--const baseUrl = 'http://bubba:8000/search/'-->
<!--const searchTerm = ref('')-->
<!--const url = computed(() => baseUrl + searchTerm.value)-->
<!--const { data, error } = useFetch(url)-->
<!--</script>-->

<template>
  <div class="col form-control-lg text-center">
    <form @submit.prevent="searchTerm=this">
      <input name="search" placeholder="Search mods..." autofocus>
    </form>
  </div>
</template>

<script>
export default {
  name: "Search",
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
