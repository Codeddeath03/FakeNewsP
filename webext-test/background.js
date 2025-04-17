chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_TITLE') {
        // Query the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Inject the content script to extract the title from the current tab
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: extractTitle
            }, (results) => {
                if (results && results[0]) {
                    const title = results[0].result; // Extracted title
                    sendResponse({ title: title }); // Send the title back to popup
                } else {
                    sendResponse({ title: 'Title not found' });
                }
            });
        });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_ARTICLE_CONTENT') {
        // Query the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Inject the content script to extract the title and article body from the current tab
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: extractArticleContent
            }, (results) => {
                if (results && results[0]) {
                    const { articleBody } = results[0].result; // Extracted title and article body
                    console.log(articleBody);
                    sendResponse({ articleBody: articleBody }); // Send the data back to popup
                } else {
                    sendResponse({ articleBody: 'Article body not found' });
                }
            });
        });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});

// Content script function to extract the title and article body
function extractArticleContent() {


    // Extract article body
    const detailDiv = document.querySelector('div.detail');
    let articleBody = '';

    if (detailDiv) {
        // Get all the <p> tags inside the <div class="detail">
        const paragraphs = detailDiv.querySelectorAll('p');
        paragraphs.forEach((p) => {
            const textContent = p.textContent.trim();
            if (textContent.length > 50) { // Filter out very short paragraphs (likely ads or non-article content)
                articleBody += textContent + '\n\n'; // Add paragraph text to the article body
            }
        });
    }

    return { articleBody: articleBody };
}


// Content script function to extract the title
function extractTitle() {
    const titleElement = document.querySelector('h1.hdg1');
    return titleElement ? titleElement.textContent.trim() : null;
}
