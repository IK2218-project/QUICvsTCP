const { readFileSync, createReadStream, writeFileSync } = require("fs");

exports.generateImageData = () => {
    const base64 = readFileSync('mario.png', 'base64');
    return base64;
};

exports.toImage = (data, index) => {
    // Translate to .png file
    //console.log("toImage, index: " + index + ", data.len: " + data.length);
    const buffer = Buffer.from(data.replace("\n", ""), "base64");
    writeFileSync("./img/recreatedImage" + index + ".png", buffer);
    
    // Dynamically add image to HTML page
    // imageContent += "<img src='./img/recreatedImage'" + index + ".png'>";
};