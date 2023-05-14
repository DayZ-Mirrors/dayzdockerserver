const express = require('express')
const path = require('path')
const app = express()
const port = 8000

app.use('/', express.static(path.join(__dirname, 'root')))

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
