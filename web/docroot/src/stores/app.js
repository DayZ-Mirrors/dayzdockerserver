import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        errorText: '',
        modId: 0,
        modFile: '',
        mods: [],
        searchText: '',
        section: 'mods',
    })
})
