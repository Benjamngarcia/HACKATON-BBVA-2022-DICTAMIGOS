const btn = document.getElementById('btn-action').addEventListener('click', windowActualFetch);

async function windowActualFetch() {

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    let tab = tabs[0];

    /* const res = await fetch(tab.url);
    let html = await res.text();
    let doc = new DOMParser().parseFromString(html, 'text/html'),
      text = doc.body.textContent || '';
    // Limpiamos los espacios
    text = text.trim().replace(/\s{2,}/g, ' ')
    console.log(text); */

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
      });
    });

  });

}



