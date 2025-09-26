const express = require('express')
const {scanDirectory} = require("./services/directoryScanner");
const {getAllImages, getLatestImages, getAllImagesFromMonth} = require("./repository/repoService");
const {imageToBase64} = require("./services/imageToBase64")
const app = express()
const port = 3000

require('dotenv').config();

app.get('/api/:user-:pass/scan', (req, res) => {
    const { user, pass } = req.params;
    if(user !== process.env.UNAME || pass !== process.env.PASSWORD) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    // scan the directory using directoryScanner, this will be called on app launch
    scanDirectory().then(r =>
    console.log(`Scanned directory: ${r.length} images found`));
    res.status(200).json({ message: 'Ready' })
})

app.get('/api/:username-:pass', (req, res) => {
    // URI: /api/'user'-'password'
     const { username, pass } = req.params;
     // Here you would typically validate the username and password
     // For demonstration, we'll just return them
     if(username === process.env.UNAME && pass === process.env.PASSWORD) {
         res.status(200).json({ message: 'Authentication successful', username });
     } else {
         res.status(401).json({ error: 'Authentication failed' });
     }
})


// get all images
app.get('/api/:user-:pass/images/all', (req, res) => {
    // Auth
    const { user, pass } = req.params;
    if(user !== process.env.UNAME || pass !== process.env.PASSWORD) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    getAllImages()
        .then(imageDetails => {
            // convert imageDetails to base64
            const imagesWithBase64 = imageToBase64(imageDetails)
            res.status(200).json(imagesWithBase64)
        })
        .catch(err => {
            console.error('Error fetching images:', err);
            res.status(500).json({ error: 'Failed to fetch images' })
        })
})

app.get('/api/:user-:pass/images/latest', (req, res) => {
    // Auth
    const { user, pass } = req.params;
    if(user !== process.env.UNAME || pass !== process.env.PASSWORD) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    getLatestImages()
        .then(imageDetails => {
            // convert imageDetails to base64
            const imagesWithBase64 = imageToBase64(imageDetails)
            res.status(200).json(imagesWithBase64)
        })
        .catch(err => {
            console.error('Error fetching latest images:', err);
            res.status(500).json({ error: 'Failed to fetch latest images' })
        })
})

app.get('/api/:user-:pass/images/:month-:year', (req, res) => {
    // Auth
    const { user, pass } = req.params;
    if(user !== process.env.UNAME || pass !== process.env.PASSWORD) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    const { month, year } = req.params;
    if (!month || !year) {
        return res.status(400).json({ error: 'Month and year are required' });
    }
    getAllImagesFromMonth(month, year)
        .then(imageDetails => {
            // convert imageDetails to base64
            const imagesWithBase64 = imageToBase64(imageDetails)
            res.status(200).json(imagesWithBase64)
        })
        .catch(err => {
            console.error('Error fetching images for month:', err);
            res.status(500).json({ error: 'Failed to fetch images for month'+month+'/'+year })
        })
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})