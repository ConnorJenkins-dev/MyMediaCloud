// const { expect } = require('chai');
// const directoryScanner = require('../services/directoryScanner');

import { expect } from 'chai';
import { scanDirectory } from '../services/directoryScanner.js';


// Mock environment variables
// process.env.MEDIA_DIR = './test';

process.env.MEDIA_DIR = 'C:\\Users\\conno\\Documents\\Java Projects\\mymediacloud\\server\\test';

// Scan the test directory and find one file, testIMG.jpg.

describe('Directory Scanner', function() {
    it('should scan the directory and return image details', async function() {
        const images = scanDirectory();
        expect(images).to.be.an('array');
        expect(images.length).to.equal(1); // Assuming there's one image in the test directory
        expect(images[0]).to.have.property('name');
        expect(images[0]).to.have.property('size');
        expect(images[0]).to.have.property('createdAt');
        expect(images[0]).to.have.property('updatedAt');
    });
});

