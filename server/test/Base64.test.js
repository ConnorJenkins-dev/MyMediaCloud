// test/imageToBase64.test.js
const { expect } = require("chai");
const { imageToBase64 } = require("../services/imageToBase64");

describe("imageToBase64", () => {
    it("converts an image object into base64", () => {
        const result = imageToBase64([
            { id: 1, name: "test.jpg", created_at: "2023-10-10", location: "./test/testIMG.jpg" },
        ]);

        expect(result[0]).to.have.property("id", 1);
        expect(result[0]).to.have.property("base64");
    });
});