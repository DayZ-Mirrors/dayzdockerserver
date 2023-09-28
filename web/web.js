/*
 A DayZ Linux server provisioning system.

 This is the web UI for provisioning a DayZ server running under Linux.
 It manages the main container that installs and maintains the base DayZ server files
 along with all mod base files. The goal being to keep all of these centralized and consistent,
 but to also make them available for the creation of server containers.
 */
import express from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { spawn } from 'child_process'

const app = express()

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*'])
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.append('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

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
 Denote if it's release or experimental
 */
const versions = {
    "1042420": "Experimental",
    "223350": "Release"
}
const appid_version = versions[server_appid]

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

// From https://helpthedeadreturn.wordpress.com/2019/07/17/dayz-sa-mission-file
const allConfigFiles = {
    "db": [ // global server config and core loot economy files
        "events.xml", // dynamic events
        "globals.xml", // global settings
        "messages.xml", // server broadcast messages and shutdown
        "types.xml" // loot table
    ],
    "env": [ // coordinates, static and dynamic spawns for each entity
        "cattle_territories.xml",
        "domestic_animals_territories.xml",
        "hare_territories.xml",
        "hen_territories.xml",
        "pig_territories.xml",
        "red_deer_territories.xml",
        "roe_deer_territories.xml",
        "sheep_goat_territories.xml",
        "wild_boar_territories.xml",
        "wolf_territories.xml",
        "zombie_territories.xml"
    ],
    "root": [
        "cfgeconomycore.xml", // loot economy core settings and extensions
        "cfgeffectarea.json", // static contaminated area coordinates and other properties
        "cfgenvironment.xml", // includes env\* files and parameters
        "cfgeventgroups.xml", // definitions of groups of objects that spawn together in a dynamic event
        "cfgeventspawns.xml", // coordinates where events may occur
        "cfggameplay.json", // gameplay configuration settings.
        "cfgIgnoreList.xml", //  list of items that won’t be loaded from the storage
        "cfglimitsdefinition.xml", // list of valid categories, tags, usageflags and valueflags
        "cfglimitsdefinitionuser.xml", // shortcut groups of usageflags and valueflags
        "cfgplayerspawnpoints.xml", // new character spawn points
        "cfgrandompresets.xml", // collection of groups of items
        "cfgspawnabletypes.xml", // loot categorization (ie hoarder) as well as set of items that spawn as cargo or as attachment on weapons, vehicles or infected.
        "cfgundergroundtriggers.json", // used for triggering light and sounds in the Livonia bunker, not used for Chernarus
        "cfgweather.xml", // weather configuration
        "init.c", // mission startup file (PC only)
        "map*.xml",
        "mapgroupproto.xml", // structures, tags, maxloot and lootpoints
        "mapgrouppos.xml" // all valid lootpoints
    ]
}

const config = {
    installFile: serverFiles + "/DayZServer",
    modDir: modDir + "/" + client_appid,
    port: 8000,
    steamAPIKey: process.env["STEAMAPIKEY"]
}

const getVersion = (installed) => {
    if(installed) {
        return "1.22.bogus"
    }
    return ""
}

const getDirSize = (dirPath) => {
    let size = 0
    if (! fs.existsSync(dirPath)) return size
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
    return ''
}

const getMods = () => {
    const mods = []
    fs.readdirSync(config.modDir).forEach(file => {
        const name = getModNameById(file)
        mods.push({name:name,id:file})
    })
    return mods
}

const login = () => {
    const args = "+force_install_dir " + serverFiles + " +login '" + config.steamLogin + "' +quit"
    steamcmd(args)
}

const steamcmd = (args) => {
    const proc = spawn('steamcmd ' + args)
    proc.stdout.on('data', (data) => {
        res.write(data)
    })
    proc.stderr.on('data', (data) => {
        res.write(data)
    })
    proc.on('error', (error) => {
        res.write(error)
    })
    proc.on('close', (error) => {
        if(error) res.write(error)
        res.end()
    })
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
    if (fs.existsSync(config.modDir + d + modId + d + file)) {
        const contents = fs.readFileSync(config.modDir + d + modId + d + file)
        res.set('Content-type', 'application/xml')
        res.send(contents)
    }
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

// Install a mod
app.get(('/install/:modId'), (req, res) => {
    const modId = req.params["modId"]
    // Shell out to steamcmd, monitor the process, and display the output as it runs
    res.send(modId + " was installed")
})

// Remove a mod
app.get(('/remove/:modId'), (req, res) => {
    const modId = req.params["modId"]
    // Shell out to steamcmd, monitor the process, and display the output as it runs
    res.send(modId + " was removed")
})

// Update base files
app.get('/updatebase', (req, res) => {
    login()
    res.send("Base files were updates")
})

// Update mods
app.get('/updatemods', (req, res) => {
    res.send("Mod files were updates")
})

/*
 Get the status of things:
 If the base files are installed, the version of the server, the appid (If release or experimental)
 */
app.get('/status', (req, res) => {
    // FIXME Async/await this stuff...
    const installed = fs.existsSync(config.installFile)
    const version = getVersion(installed)
    const ret = {
        "appid": appid_version,
        "installed": installed,
        "version": version
    }
    ret.error = "This is a test error from the back end"
    res.send(ret)
})

/*
 Get all mod metadata
 */
app.get('/mods', (req, res) => {
    const mods = getMods()
    const ret = {
        "mods": mods
    }
    res.send(ret)
})

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`)
})
