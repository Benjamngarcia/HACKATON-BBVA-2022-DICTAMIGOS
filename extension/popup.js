const btn = document.getElementById('btn-action').addEventListener('click', windowActualFetch);

async function windowActualFetch() {

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    let tab = tabs[0];
    //tab.url    
    chrome.tabs.create({
      url: 'file:///C:/Users/52554/Documents/Development/Projects/HACKATON-BBVA-2022-DICTAMIGOS/app-web/index.html?url=' + tab.url
    });
  });

}

