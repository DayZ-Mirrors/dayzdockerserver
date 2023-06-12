const template = `
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
                {{ fetchError }}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<div class="container-fluid min-vh-100 d-flex flex-column bg-light">
    <div class="row">
        <div class="col-3 text-center">
            <h1>DayZ Docker Server</h1>
        </div>
        <div class="col-5">
            <button
                @click="installbase"
                :class="'btn ' + (installed ? 'btn-danger' : 'btn-success')"
            >
                Install Server Files
            </button>
            <button @click="updatebase" class="btn btn-success">Update Server Files</button>
            <button @click="updatemods" class="btn btn-success">Update Mods</button>
            <button @click="servers" class="btn btn-primary">Servers</button>
            <button @click="listmods" class="btn btn-primary">Mods</button>
        </div>
        <div class="col form-control-lg text-center">
            <form @submit="handleSubmit">
                <input name="search" placeholder="Search mods..." autofocus>
            </form>
        </div>
        <div class="col">
            <div>
                Server files installed:
                <span class="bi bi-check h2 text-success" v-if="installed"></span>
                <span class="bi bi-x h2 danger text-danger" v-else></span>
            </div>
            <div v-if="version != ''">
                Version: <span class="text-success font-weight-bold">{{ version }}</span>
            </div>
        </div>
    </div>
    <div class="row flex-grow-1">
        <div class="col-md-3 border">
            <div>
                <h4 class="text-center">Installed Mods</h4>
                <table>
                    <tr>
                        <th>Steam Link</th>
                        <th>Mod Info</th>
                    </tr>
                    <template
                        v-for="mod in mods"
                    >
                    <tr>
                        <td>
                            <a
                                target="_blank"
                                :href="steamURL + mod.id"
                            >
                                {{ mod.id }}
                            </a>
                        </td>
                        <td>
                            <a class="simulink" @click="getModInfo(mod.id)">{{ mod.name }}</a>
                        </td>                            
                    </tr>
                    </template>
                </table>
            </div>
        </div>
        <div class="col-md-9 border">
            <div class="d-flex" v-if="modInfo != ''">
                <div>
                    <div>
                        <strong>{{ modInfo.name }}</strong>
                    </div>
                    <div>
                        ID: {{ modInfo.id }}
                    </div>
                    <div>
                        Size: {{ modInfo.size.toLocaleString("en-US") }}
                    </div>
                    <div v-if="modInfo.customXML.length > 0">
                        Custom XML files:
                        <ul>
                            <li v-for="info in modInfo.customXML">
                                <a
                                    :class="'simulink xmlfile ' + info.name"
                                    @click="getXMLInfo(modInfo.id,info.name)"
                                >
                                    {{ info.name }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>                    
                <div class="col-1"></div>
                <div>
                    <xmltree v-if="XMLInfo != ''" :xmlData="XMLInfo" />
                </div>
            </div>
            <div v-if="searchResults != ''" class="d-flex">
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
                            <button v-if="mods.find(o => o.id == result.publishedfileid)" @click="removeMod(result.publishedfileid)" type="button" class="btn btn-danger">Remove</button>
                            <button v-else @click="installMod(result.publishedfileid)" type="button" class="btn btn-success">Install</button>
                        </td>                   
                    </tr>                
                </table>
            </div>
        </div>
    </div>
</div>
`

import xmltree from "/xmltree.js"

const fetcher = (args) => {
    fetch(args.url)
        .then(response => (
            args.type === "json" ? response.json() : response.text()
        ))
        .then(response => args.callback(response))
        .catch((error) => {
            console.error(error)
            this.fetchError = error.message
        })
}

export default {
    name: 'DazDockerServer',
    template: template,
    components: {
        xmltree
    },
    data() {
        return {
            fetchError: "",
            installed: false,
            mods: [],
            modInfo: "",
            searchResults: [],
            steamURL: 'https://steamcommunity.com/sharedfiles/filedetails/?id=',
            version: "Unknown",
            XMLFile: "",
            XMLInfo: "",
        }
    },
    methods: {
        getModInfo(modId) {
            fetcher ({
                url: '/mod/' + modId,
                type: "json",
                callback: (response) => {
                    this.modInfo = response
                    this.XMLInfo = ""
                    this.searchResults = ""
                }
            })
        },
        getXMLInfo(modId, file) {
            for (const e of document.getElementsByClassName("selected")) e.classList.remove("selected")
            fetch('/mod/' + modId + '/' + file)
                .then(response => response.text())
                .then(response => {
                    this.XMLFile = file
                    this.XMLInfo = response
                    for (const e of document.getElementsByClassName(file)) e.classList.add("selected")
                })
                .catch((error) => {
                    console.error(error)
                    this.fetchError = error.message
                })
        },
        handleSubmit(e) {
            e.preventDefault()
            fetch('/search/' + e.target.search.value)
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
                    $('.alert').alert()
                })
                .catch((error) => {
                    console.error(error)
                    this.fetchError = error.message
                })
        },
        installMod(modId) {
            fetch('/install/' + modId)
                .then(response => response.text())
                .then(response => {
                    console.log(response)
                })
                .catch((error) => {
                    console.error(error)
                    this.fetchError = error.message
                })
        },
        removeMod(modId) {
            fetch('/remove/' + modId)
                .then(response => response.text())
                .then(response => {
                    console.log(response)
                })
                .catch((error) => {
                    console.error(error)
                    this.fetchError = error.message
                })
        },
        BKMG(val) {
            const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
            let l = 0, n = parseInt(val, 10) || 0
            while(n >= 1024 && ++l){
                n = n/1024
            }
            return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
        },
        installbase() {
            console.log("Install base files")
        },
        servers() {
            console.log("List servers")
        },
        listmods() {
            console.log("List mods")
        },
        updatebase() {
            console.log("Update base files")
        },
        updatemods() {
            console.log("Update mod files")
        }
    },
    mounted() {
        // Get the data
        fetch('/status')
            .then(response => response.json())
            .then(response => {
                this.installed = response.installed
                this.version = response.version
                this.mods = response.mods
                if(response.error) {
                    this.fetchError = response.error
                    // Since it's a modal, we have to manually show it...?
                    const modal = new bootstrap.Modal(document.getElementById('errorModal'))
                    modal.show()
                }
            })
            .catch((error) => {
                console.error(error)
                this.fetchError = error.message
            })
    }
}

/*

{ "result": 1, "publishedfileid": "2489240546", "creator": "76561199068873691", "creator_appid": 221100, "consumer_appid": 221100, "consumer_shortcutid": 0, "filename": "", "file_size": "276817803", "preview_file_size": "27678", "preview_url": "https://steamuserimages-a.akamaihd.net/ugc/2011465736408144669/A7137390FBB9F4F94E0BFE5389932F6DE7AB7B87/", "url": "", "hcontent_file": "4050838808220661564", "hcontent_preview": "2011465736408144669", "title": "LastDayZ_Helis", "short_description": "The author of the helicopter mod https://sibnic.info on the site you can download the latest version of free helicopters, If you need help with installation, go to discord https://sibnic.info/discord", "time_created": 1621186063, "time_updated": 1684985831, "visibility": 0, "flags": 5632, "workshop_file": false, "workshop_accepted": false, "show_subscribe_all": false, "num_comments_public": 0, "banned": false, "ban_reason": "", "banner": "76561197960265728", "can_be_deleted": true, "app_name": "DayZ", "file_type": 0, "can_subscribe": true, "subscriptions": 7935, "favorited": 3, "followers": 0, "lifetime_subscriptions": 22759, "lifetime_favorited": 5, "lifetime_followers": 0, "lifetime_playtime": "0", "lifetime_playtime_sessions": "0", "views": 535, "num_children": 0, "num_reports": 0, "tags": [ { "tag": "Animation", "display_name": "Animation" }, { "tag": "Environment", "display_name": "Environment" }, { "tag": "Sound", "display_name": "Sound" }, { "tag": "Vehicle", "display_name": "Vehicle" }, { "tag": "Mod", "display_name": "Mod" } ], "language": 0, "maybe_inappropriate_sex": false, "maybe_inappropriate_violence": false, "revision_change_number": "14", "revision": 1, "ban_text_check_result": 5 }

 */
