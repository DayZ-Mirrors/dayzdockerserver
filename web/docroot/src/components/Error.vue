<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useErrorStore } from '@/stores/error'
const { errorText } = storeToRefs(useErrorStore())
import { Modal } from 'bootstrap'
let modal = {}
onMounted(() => {
  modal = new Modal('#errorModal', {})
  // modal.show()
})
</script>

<template>
  <div
      class="modal"
      id="errorModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="errorModalLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="errorModalLabel">Error</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          {{ errorText }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
