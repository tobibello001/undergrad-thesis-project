const cheerio = require("cheerio");
const fs = require("fs");

fs.readFile("news.html", 'utf8', (err, htmlData) => {
    // console.log(htmlData);
    if (err) {
        console.error(`Got error: ${err.message}`);
    }
    const body = /<body[\s\S]*?<\/body>/mg.exec(htmlData);
    fs.writeFile("body.html", body, (err) => {
        if (err) {
            console.error(`Got error: ${err.message}`);
        }
        console.log("Body Saved");
    })
})