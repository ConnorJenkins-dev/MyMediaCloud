import { createRequire } from 'module';
import { saveImageDetails } from "../repository/repoService.js";
// import donenv from 'dotenv';
import 'dotenv/config';
import * as path from "node:path";

const require = createRequire(import.meta.url);
// checks for new images and updates the database accordingly

const fs = require('fs');

export function scanDirectory() {

    fs.readdir(process.env.MEDIA_DIR, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            process.exit(1);
        }
    });
    // iterate over files
    const images = [];
    fs.readdirSync(process.env.MEDIA_DIR).forEach(file => {
        // check if file is an image
        if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
            const filePath = path.join(process.env.MEDIA_DIR, file);
            const stats = fs.statSync(filePath);
            // Save to database
            // changed call to get modified date to mtime, should work with Linux
            saveImageDetails(file, stats.mtime, filePath).catch(err => {
                console.error('Error saving image details:', err);
            });
            // push image details to array
            images.push({
                name: file,
                size: stats.size,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime
            });
        }
    });
    // return images
    return images;
}