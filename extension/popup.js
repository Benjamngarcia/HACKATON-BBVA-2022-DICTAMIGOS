const btn = document.getElementById('btn-action').addEventListener('click', windowActualFetch);

async function windowActualFetch() {

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    let tab = tabs[0];
    //tab.url    
    chrome.tabs.create({
      url: 'https://biaschecker.netlify.app/?url=' + tab.url
    });
  });

}

