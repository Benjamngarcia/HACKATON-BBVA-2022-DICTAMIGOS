const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const cheerio = require('cheerio');
const request = require('request');
const bodyParser = require('body-parser');
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
                $('script').remove();
                $('noscript').remove();
                $('style').remove();
                $('body').each((i, el) => {
                    //get all text into body tag
                    const content = $(el).find("*").text()

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

// setTimeout(async () => {
//   let queryStr = window.location.search;
//   let urlParams = new URLSearchParams(queryStr);
//   let param = urlParams.get("url");
//   let datas = [];

//   request(param, (err, response, html) => {
//     if (response.statusCode === 200) {
//       const $ = cheerio.load(html);
//       $('script').remove();
//       $('noscript').remove();
//       $('style').remove();
//       $('body').each((i, el) => {
//         //get all text into body tag
//         const content = $(el).find("*").text()

//         let data = {
//           content
//         }
//         datas.push(data);
//       })
//     }
//     // console.log(Object.getOwnPropertyNames(datas));
//     // console.log(typeof(datas[0].content));
//     console.log(datas);
//   })
//   // Se hace una petición a la URL que contiene los datos
//   // scrapping
//   /* let res;
//   try {
//     res = await fetch(param);
//   } catch (error) {
//     alert('La pagina no permitiio dicha operacion.')
//   }
//   let html = await res.text();
//   // Se toma la respuesta y se convierte a texto plano
//   const $ = cheerio.load(html);
//   $('script').remove();
//   $('noscript').remove();
//   $('style').remove();
//   $('body').each((i, el) => {
//     //get all text into body tag
//     const content = $(el).find("*").text()
//     let data = {
//       content
//     }
//     datas.push(data);
//   })

//   /* let doc = new DOMParser().parseFromString(html, 'text/html'),
//     text = doc.body.textContent || '';
//   // Limpiamos los espacios
//   text = text.trim().replace(/\s{2,}/g, ' ') */
//   //console.log(datas);

//   const threshold = 0.9;

//   // Load the model. Users optionally pass in a threshold and an array of
//   // labels to include.
//   toxicity.load(threshold).then(model => {
//     const sentences = ['you suck'];

//     model.classify(sentences).then(predictions => {
//       // `predictions` is an array of objects, one for each prediction head,
//       // that contains the raw probabilities for each input along with the
//       // final prediction in `match` (either `true` or `false`).
//       // If neither prediction exceeds the threshold, `match` is `null`.

//       console.log(predictions);
//       /*
//       prints:
//       {
//         "label": "identity_attack",
//         "results": [{
//           "probabilities": [0.9659664034843445, 0.03403361141681671],
//           "match": false
//         }]
//       },
//       {
//         "label": "insult",
//         "results": [{
//           "probabilities": [0.08124706149101257, 0.9187529683113098],
//           "match": true
//         }]
//       },
//       ...
//        */
//     });
//   });
// }, 150);

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
})

