import { createRequire } from 'module';
import * as path from "node:path";

// Convert image to base64
const require = createRequire(import.meta.url);
const fs = require('fs');

//create class for image details and base64 string
class imageBase64 {
    constructor(id, name, createdAt, location, base64) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.location = location;
        this.base64 = base64;
    }
}

// ingest array called imageDetails


export function imageToBase64(imageDetails) {
    const imagesWithBase64 = [];
    imageDetails.forEach(image => {
        // check if valid file path
        if (!fs.existsSync(image.location)) {
            console.error(`File not found: ${image.location}`);
            const imageWithBase64 = new imageBase64(image.id, image.name, image.created_at, image.location, null);
            return imagesWithBase64.push(imageWithBase64);
        }
        const filePath = path.join(image.location);
        // read file and convert to base64
        const file = fs.readFileSync(filePath);
        const base64 = Buffer.from(file).toString('base64');
        // create new imageBase64 object
        const imageWithBase64 = new imageBase64(image.id, image.name, image.created_at, image.location, base64);
        imagesWithBase64.push(imageWithBase64);
    });
    return imagesWithBase64;

}