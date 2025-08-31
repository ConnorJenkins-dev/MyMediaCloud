const express = require('express')
const {scanDirectory} = require("./services/directoryScanner");
const app = express()
const port = 3000

require('dotenv').config();

app.get('/api/scan', (req, res) => {
    // scan the directory using directoryScanner, this will be called on app launch
    scanDirectory().then(r =>
    console.log(`Scanned directory: ${r.length} images found`));
    res.json({ message: 'Hello from the server!' })
})

app.get('/api/images', (req, res) => {
    // run directoryScanner and return array of images
    const directoryScanner = require('./services/directoryScanner')
    directoryScanner.scanDirectory()
        .then(images => {
            res.json(images)
        })
        .catch(err => {
            console.error('Error scanning directory:', err)
            res.status(500).json({ error: 'Failed to scan directory' })
        })
})

app.get('/api/:username-:pass', (req, res) => {
     const { username, pass } = req.params;
     // Here you would typically validate the username and password
     // For demonstration, we'll just return them
     if(username === process.env.UNAME && pass === process.env.PASSWORD) {
         res.status(200).json({ message: 'Authentication successful', username });
     } else {
         res.status(401).json({ error: 'Authentication failed' });
     }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})