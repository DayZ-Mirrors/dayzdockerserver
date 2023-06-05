import { ref, isRef, unref, watchEffect } from 'vue'
const baseUrl = 'http://bubba:8000'

export function useFetch(url) {
    const data = ref(null)
    const error = ref(null)
    async function doFetch() {
        data.value = null
        error.value = null
       const urlValue = unref(baseUrl + url)
        try {
            const res = await fetch(urlValue)
            data.value = await res.json()
        } catch (e) {
            error.value = e
        }
    }
    if (isRef(url)) {
        watchEffect(doFetch)
    } else {
        doFetch()
    }
    return { data, error, retry: doFetch }
}
