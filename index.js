const https = require("https");
const fs = require("fs");

const cheerio = require("cheerio");
const sanitizeHtml = require('sanitize-html');
const mongoose = require('mongoose');
const request = require('request');

const Post = require('./models/posts');

const writeTextToFile = (filename, text) => {
    fs.writeFile(filename, text, (err) => {
        if (err) {
            console.error(`Got error: ${err.message}`);
        }
        console.log(`${filename} saved`);
    })
}

mongoose.connect('mongodb://localhost:27017/UnilagNewsPosts', { autoIndex: false, useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        return console.error(err);
    });



request('https://unilag.edu.ng/news/', (err, response, body) => {

    if (err) console.error(`Got error: ${err.message}`);

    cleanHtml = sanitizeHtml(body, { allowedAttributes: false, allowedTags: false });

    let filtered;
    filtered = sanitizeHtml(cleanHtml, {
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
        postDetails.imageLink = $('img').attr('src') || null;
        // postDetails.shortDescription = $('div.fusion-post-content-container p').text()
        postDetails.updated = new Date($('span.updated').text())
        return postDetails;
    })
    posts.sort((a, b) => b.updated - a.updated);

    posts.forEach(post => {
        let postDoc = new Post(post);
        postDoc.save(function (err) {
            if (err) return console.error(err);
            console.log(`${postDoc.title} Saved`);
        })
    });
})
