const { expect } = require('chai');
const directoryScanner = require('../services/directoryScanner');


// Mock environment variables
process.env.MEDIA_DIR = './test';

// Scan the test directory and find one file, testIMG.jpg.

describe('Directory Scanner', function() {
    it('should scan the directory and return image details', async function() {
        const images = await directoryScanner.scanDirectory();
        expect(images).to.be.an('array');
        expect(images.length).to.equal(1); // Assuming there's one image in the test directory
        expect(images[0]).to.have.property('name');
        expect(images[0]).to.have.property('size');
        expect(images[0]).to.have.property('createdAt');
        expect(images[0]).to.have.property('updatedAt');
    });
});

