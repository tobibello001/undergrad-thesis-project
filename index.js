const https = require("https");
const http = require("http");
const cheerio = require("cheerio");
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

getHTMLData('https://unilag.edu.ng/news/').then((htmlData) => {
    console.log(htmlData);
}).catch((error) => {
    console.error(`Got error: ${error.message}`);
})