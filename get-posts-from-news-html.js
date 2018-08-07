const fs = require("fs");

const cheerio = require("cheerio");
const sanitizeHtml = require('sanitize-html');

const writeTextToFile = (filename, text) => {
    fs.writeFile(filename, text, (err) => {
        if (err) {
            console.error(`Got error: ${err.message}`);
        }
        console.log(`${filename} saved`);
    })
}

fs.readFile("news.html", 'utf8', (err, htmlData) => {
    // console.log(htmlData);
    if (err) {
        console.error(`Got error: ${err.message}`);
    }
    let filtered;
    filtered = sanitizeHtml(htmlData, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'img', 'body', 'span'],
        allowedClasses: { 'h2': ['entry-title'], 'div': ['post', 'fusion-post-content-container'], 'span': ['updated'] },
    });

    let $ = cheerio.load(filtered);

    let htmlOFPosts = [];
    $("div.post").each((i, ele) => {
        dhtml = $(ele).html()
        // writeTextToFile(`post-${i + 1}.html`, dhtml );
        htmlOFPosts.push(dhtml);
    })

    let posts = htmlOFPosts.map(value => {
        let postDetails = {}
        $ = cheerio.load(value);
        postDetails.title = $('h2.entry-title a').text()
        postDetails.link = $('h2.entry-title a').attr('href')
        postDetails.image = $('img').attr('src') || null;
        postDetails.shortDescription = $('div.fusion-post-content-container p').text()
        postDetails.updated = new Date($('span.updated').text())
        return postDetails;
    })
    console.log(posts);

    // writeTextToFile("parsed-news.html", filtered)
})