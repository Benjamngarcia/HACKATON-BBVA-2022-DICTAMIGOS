const express = require('express');
const cheerio = require('cheerio');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const robotsParser = require('robots-txt-parser');

const app = express();

app.set('port', process.env.PORT || 5000)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const robots = robotsParser();

app.get('/', (req, res) => res.render('index', { layout: 'main' }));
app.get('/search', async (req, res) => {

    const { tag } = req.query;
    let datas = [];

    //check robots.txt
    await robots.useRobotsFor(tag)
    if (await robots.canCrawl(tag)) {
        request(tag, (err, response, html) => {
            if (response.statusCode === 200) {
                const $ = cheerio.load(html);
                $('body').each((i, el) => {
                    //get all text into body tag
                    const content = $(el).text()

                    let data = {
                        content
                    }
                    datas.push(data);
                })
            }
            // console.log(Object.getOwnPropertyNames(datas));
            // console.log(typeof(datas[0].content));
            console.log(datas);
            res.render('list', { datas })
        })
    } else {
        console.log('Sorry, web scraping is not allowed on this route.')
    }
})


app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
})