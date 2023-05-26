import express from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'

const app = express()

/*
 The DayZ server Steam app ID. USE ONE OR THE OTHER!!

 Presumably once the Linux server is officially released, the binaries will come from this ID.
 Meanwhile, if we have a release-compatible binary, the base files must be installed from this id,
 even if the server binary and required shared objects don't come from it. (They'd come from...elsewhere...)
 */
//const server_appid = "223350"

/*
 Without a release binary, we must use the experimental server app ID.
 */
const server_appid = "1042420"

/*
 DayZ release client Steam app ID. This is for mods, as only the release client has them.
 */
const client_appid = "221100"

/*
 Base file locations
 */
const modDir = "/mods"
const serverFiles = "/serverfiles"

/*
 File path delimiter
 */
const d = '/'

/*
 XML config files the system can handle. These are retrieved from values in templates located in /files/mods/:modId
 */
const configFiles = [
    'cfgeventspawns.xml',
    'cfgspawnabletypes.xml',
    'events.xml',
    'types.xml',
]

const config = {
    installFile: serverFiles + "/DayZServer",
    modDir: modDir + "/" + client_appid,
    port: 8000,
    steamAPIKey: process.env["STEAMAPIKEY"]
}

const getDirSize = (dirPath) => {
    let size = 0
    const files = fs.readdirSync(dirPath)
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dirPath, files[i])
        const stats = fs.statSync(filePath)
        if (stats.isFile()) {
            size += stats.size
        } else if (stats.isDirectory()) {
            size += getDirSize(filePath)
        }
    }
    return size
}

const getCustomXML = (modId) => {
    const ret = []
    for(const file of configFiles) {
        if (fs.existsSync(config.modDir + d + modId + d + file)) {
            ret.push({name:file})
        }
    }
    return ret
}

const getModNameById = (id) => {
    const files = fs.readdirSync(serverFiles, {encoding: 'utf8', withFileTypes: true})
    for (const file of files) {
        if (file.isSymbolicLink()) {
            const sym = fs.readlinkSync(serverFiles + d + file.name)
            if(sym.indexOf(id) > -1) return file.name
        }
    }
}

const getMods = () => {
    const mods = []
    fs.readdirSync(config.modDir).forEach(file => {
        const name = getModNameById(file)
        mods.push({name:name,id:file})
    })
    return mods
}

app.use(express.static('root'))

// Get mod metadata by ID
app.get('/mod/:modId', (req, res) => {
    const modId = req.params["modId"]
    const modDir = config.modDir + d + modId
    const customXML = getCustomXML(modId)
    const ret = {
        id: modId,
        name: getModNameById(modId),
        size: getDirSize(modDir),
        customXML: customXML
    }
    res.send(ret)
})

// Get a mod's XML file
app.get('/mod/:modId/:file', (req, res) => {
    const modId = req.params["modId"]
    const file = req.params["file"]
    const contents = fs.readFileSync(config.modDir + d + modId + d + file)
    res.send(contents)
})

// Search for a mod
app.get(('/search/:searchString'), (req, res) => {
    const searchString = req.params["searchString"]
    const url = "https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?numperpage=1000&appid=221100&return_short_description=true&strip_description_bbcode=true&key=" + config.steamAPIKey + "&search_text=" + searchString
    https.get(url, resp => {
        let data = '';
        resp.on('data', chunk => {
            data += chunk;
        });
        resp.on('end', () => {
            res.send(JSON.parse(data))
        })
    }).on('error', err => {
        console.log(err.message)
    })
})

/*
 Get the status of things:
 If the base files are installed, the version of the server, a list of mods, etc.
 */
app.get('/status', (req, res) => {
    // FIXME Async/await this stuff...
    const installed = fs.existsSync(config.installFile)
    const mods = getMods()
    const ret = {
        "installed": installed,
        "version": "1.20.bogus",
        "mods": mods
    }
    res.send(ret)
})

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`)
})
