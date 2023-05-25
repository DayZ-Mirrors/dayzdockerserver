const template = `
	<div class="container-fluid">
		<div class="row jumbotron darkgrey">
		    <div class="col-10">
		        <h1>DayZ Docker Server</h1>
		    </div>
            <div class="col-2">
                <div>
                    Server files installed: {{ installed }}
                </div>
                <div>
                    Version: {{ version }}
                </div>
    		</div>
		</div>
		<div
			v-if="fetchError != ''"
			class="row jumbotron text-center alert alert-danger"
		>
			{{ fetchError }}
		</div>
        <div class="row jumbotron darkgrey">
            <div class="col-3">
                <h2 class="text-center">Mods</h2>
                <table>
                    <tr>
                        <th>Steam Link</th>
                        <th>Mod Info</th>
                    </tr>
                    <template
                        v-for="mod in mods"
                        :key="index"
                    >
                    <tr>
                        <td>
                            <a
                                target="_blank"
                                :href="'https://steamcommunity.com/sharedfiles/filedetails/?id=' + mod.id"
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
            <div class="col-9 modInfo" v-if="modInfo != ''">
                <div class="text-center col-12">
                    <h2>{{ modInfo.name }} mod info:</h2>                    
                </div>
                <div class="row">
                    <div class="col-2">
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
                    <div class="col-10">
                        <textarea cols="120" rows="15" v-if="this.XMLInfo != ''">{{ this.XMLInfo }}</textarea>    
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>
`

export default {
    name: 'DazDockerServer',
    template: template,
    data() {
        return {
            fetchError: "",
            installed: false,
            mods: [],
            modInfo: "",
            version: "Unknown",
            XMLFile: "",
            XMLInfo: "",
        }
    },
    methods: {
        getModInfo(modId) {
            fetch('/mod/' + modId)
                .then(response => response.json())
                .then(response => {
                    this.modInfo = response
                    this.XMLInfo = ""
                })
                .catch((error) => {
                    console.error(error)
                    this.fetchError = error.message
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
                }
            })
            .catch((error) => {
                console.error(error)
                this.fetchError = error.message
            })
    }
}
