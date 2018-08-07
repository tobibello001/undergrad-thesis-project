const https = require("https");
const fs = require("fs");

const cheerio = require("cheerio");
const sanitizeHtml = require('sanitize-html');

const getHTMLData = url => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^text\/html/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                reject(error);
                // consume response data to free up memory
                res.resume();
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                const parsedData = rawData;
                resolve(parsedData);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}

const writeTextToFile = (filename, text) => {
    fs.writeFile(filename, text, (err) => {
        if (err) {
            console.error(`Got error: ${err.message}`);
        }
        console.log(`${filename} saved`);
    })
}

getHTMLData('https://unilag.edu.ng/news/')
    .then((htmlData) => {
        cleanHtmlData = sanitizeHtml(htmlData, { allowedAttributes: false, allowedTags: false });

        let filtered;
        filtered = sanitizeHtml(cleanHtmlData, {
            allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'img', 'body', 'span'],
            allowedClasses: { 'h2': ['entry-title'], 'div': ['post', 'fusion-post-content-container'], 'span': ['updated'] },
        });

        let $ = cheerio.load(filtered);

        let htmlOFPosts = [];
        $("div.post").each((i, ele) => {
            dhtml = $(ele).html()
            htmlOFPosts.push(dhtml);
        })

        let posts = htmlOFPosts.map(value => {
            let postDetails = {}
            $ = cheerio.load(value);
            postDetails.title = $('h2.entry-title a').text()
            postDetails.link = $('h2.entry-title a').attr('href')
            postDetails.image = $('img').attr('src') || null;
            // postDetails.shortDescription = $('div.fusion-post-content-container p').text()
            postDetails.updated = new Date($('span.updated').text())
            return postDetails;
        })
        posts.sort((a, b) => b.updated - a.updated);

        console.log(posts);
    })
    .catch((err) => {
        console.dir(err);
        console.error(`Got error: ${err.message}`);
    })

