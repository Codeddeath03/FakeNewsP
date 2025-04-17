document.getElementById('checkNews').addEventListener('click', async () => {
    // Fetch the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Fetch title and article content
    const { title, articleBody } = await getTitleAndArticleContent();
    console.log(articleBody);
    if (title && articleBody) {
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title:title, text: articleBody })
        });

        if (!response.ok) {
            console.error("Failed to fetch:", response.status, response.statusText);
            document.getElementById('result').textContent = 'Error with the server request.';
            return;
        }

        const data = await response.json();
        console.log(data.prediction);
        document.getElementById('result').textContent = data.prediction === "Fake"
            ? 'The news is likely fake.'
            : 'The news seems to be real.';
    } else {
        document.getElementById('result').textContent = 'Failed to retrieve article information.';
    }
});

async function getTitleAndArticleContent() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'GET_TITLE' }, (titleResponse) => {
            chrome.runtime.sendMessage({ type: 'GET_ARTICLE_CONTENT' }, (articleResponse) => {
                resolve({
                    title: titleResponse.title || 'No title found.',
                    articleBody: articleResponse.articleBody || 'No article body found.'
                });
            });
        });
    });
}