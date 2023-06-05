import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
export const useErrorStore = defineStore('errors', () => {
    const errorText = ref(null)
    watch(errorText, (t) => {
        console.log("errorText: " + t)
    })
    return { errorText }
})
