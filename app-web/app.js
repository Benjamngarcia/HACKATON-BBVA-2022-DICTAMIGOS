setTimeout(async () => {
  let queryStr = window.location.search;
  let urlParams = new URLSearchParams(queryStr);
  let param = urlParams.get("url");
  let datas = [];
  // Se hace una petición a la URL que contiene los datos
  let res;
  try {
    res = await fetch(param);
  } catch (error) {
    alert('La pagina no permitiio dicha operacion.')
  }
  let html = await res.text();
  // Se toma la respuesta y se convierte a texto plano
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
  
  /* let doc = new DOMParser().parseFromString(html, 'text/html'),
    text = doc.body.textContent || '';
  // Limpiamos los espacios
  text = text.trim().replace(/\s{2,}/g, ' ') */
  console.log(datas);

  const threshold = 0.9;

  // Load the model. Users optionally pass in a threshold and an array of
  // labels to include.
  toxicity.load(threshold).then(model => {
    const sentences = ['you suck'];

    model.classify(sentences).then(predictions => {
      // `predictions` is an array of objects, one for each prediction head,
      // that contains the raw probabilities for each input along with the
      // final prediction in `match` (either `true` or `false`).
      // If neither prediction exceeds the threshold, `match` is `null`.

      console.log(predictions);
      /*
      prints:
      {
        "label": "identity_attack",
        "results": [{
          "probabilities": [0.9659664034843445, 0.03403361141681671],
          "match": false
        }]
      },
      {
        "label": "insult",
        "results": [{
          "probabilities": [0.08124706149101257, 0.9187529683113098],
          "match": true
        }]
      },
      ...
       */
    });
  });
}, 150);

