const cheerio = require("cheerio");
const fs = require("fs");
const htmlValidator = require("html-validator");

fs.readFile("body.html", 'utf8', (err, body) => {
    // console.log(htmlData);
    if (err) {
        console.error(`Got error: ${err.message}`);
    }
    const bodyNoClassOrIdAttr = body.replace(/(\s+(class|id|style|data-.+?)\s*=\s*".*?"|<(style|script|![--]?)[\s\S]*?[<\/]?(style|script|--)>)/g, "");
    fs.writeFile("bodyNoClassOrIdAttr.html", bodyNoClassOrIdAttr, (err) => {
        if (err) {
            console.error(`Got error: ${err.message}`);
        }
        console.log("Body Saved");
    })
})