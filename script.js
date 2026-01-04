// Configuration: Maps engine codes to their search URLs and display names
const searchEngines = {
    // Mainstream & Global
    google: { name: "Google", url: "https://www.google.com/search?q={query}" },
    bing: { name: "Bing", url: "https://www.bing.com/search?q={query}" },
    yahoo: { name: "Yahoo", url: "https://search.yahoo.com/search?p={query}" },
    duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q={query}" },
    yandex: { name: "Yandex", url: "https://yandex.com/search/?text={query}" },
    baidu: { name: "Baidu", url: "https://www.baidu.com/s?wd={query}" },
    
    // Privacy Focused
    startpage: { name: "Startpage", url: "https://www.startpage.com/sp/search?query={query}" },
    brave: { name: "Brave Search", url: "https://search.brave.com/search?q={query}" },
    ecosia: { name: "Ecosia", url: "https://www.ecosia.org/search?q={query}" },
    qwant: { name: "Qwant", url: "https://www.qwant.com/?q={query}" },
    mojeek: { name: "Mojeek", url: "https://www.mojeek.com/search?q={query}" },
    
    // Regional
    naver: { name: "Naver", url: "https://search.naver.com/search.naver?query={query}" },
    
    // Specialized / Niche
    wolfram: { name: "Wolfram Alpha", url: "https://www.wolframalpha.com/input/?i={query}" },
    scholar: { name: "Google Scholar", url: "https://scholar.google.com/scholar?q={query}" },
    pubmed: { name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/?term={query}" },
    wayback: { name: "Wayback Machine", url: "https://web.archive.org/web/*/{query}" }
    // You can add more engines from your list here
};

// DOM Elements
const mainSearchInput = document.getElementById('mainSearchInput');
const searchButton = document.getElementById('searchButton');
const panel1Select = document.getElementById('panel1Select');
const panel2Select = document.getElementById('panel2Select');
const panel3Select = document.getElementById('panel3Select');
const panel1Title = document.getElementById('panel1Title');
const panel2Title = document.getElementById('panel2Title');
const panel3Title = document.getElementById('panel3Title');
const panel1Link = document.getElementById('panel1Link');
const panel2Link = document.getElementById('panel2Link');
const panel3Link = document.getElementById('panel3Link');
const resultFrame1 = document.getElementById('resultFrame1');
const resultFrame2 = document.getElementById('resultFrame2');
const resultFrame3 = document.getElementById('resultFrame3');
const placeholder1 = document.getElementById('placeholder1');
const placeholder2 = document.getElementById('placeholder2');
const placeholder3 = document.getElementById('placeholder3');
const swapPanelsBtn = document.getElementById('swapPanelsBtn');
const presetButtons = document.querySelectorAll('.preset-btn');

// Initialize panel titles and placeholders
updatePanelTitles();

// Perform the main search across all panels
function performSearch() {
    const query = mainSearchInput.value.trim();
    
    if (!query) {
        alert('Please enter a search query.');
        mainSearchInput.focus();
        return;
    }
    
    // Encode the query for use in a URL
    const encodedQuery = encodeURIComponent(query);
    
    // Update and load results for each panel
    updatePanel(1, panel1Select.value, encodedQuery, query);
    updatePanel(2, panel2Select.value, encodedQuery, query);
    updatePanel(3, panel3Select.value, encodedQuery, query);
    
    // Update the page title
    document.title = `"${query}" - MetaSearch Results`;
}

// Update a single panel with new results
function updatePanel(panelNumber, engineCode, encodedQuery, originalQuery) {
    const engine = searchEngines[engineCode];
    if (!engine) {
        console.error(`Engine "${engineCode}" not configured.`);
        return;
    }
    
    // Update the panel's title
    const titleElement = document.getElementById(`panel${panelNumber}Title`);
    titleElement.textContent = `${engine.name} Results`;
    
    // Update the direct link
    const linkElement = document.getElementById(`panel${panelNumber}Link`);
    const directUrl = engine.url.replace('{query}', encodedQuery);
    linkElement.href = directUrl;
    
    // Hide the placeholder and show the iframe
    const placeholder = document.getElementById(`placeholder${panelNumber}`);
    const resultFrame = document.getElementById(`resultFrame${panelNumber}`);
    
    placeholder.style.display = 'none';
    resultFrame.style.display = 'block';
    
    // Load the search results into the iframe
    // Note: Some sites may block being loaded in an iframe (X-Frame-Options)
    resultFrame.src = directUrl;
}

// Update panel titles based on current selection
function updatePanelTitles() {
    const engine1 = searchEngines[panel1Select.value];
    const engine2 = searchEngines[panel2Select.value];
    const engine3 = searchEngines[panel3Select.value];
    
    if (engine1) panel1Title.textContent = `${engine1.name} Results`;
    if (engine2) panel1Title.textContent = `${engine2.name} Results`;
    if (engine3) panel1Title.textContent = `${engine3.name} Results`;
}

// Swap the engines between panels 1 and 2
function swapPanels() {
    const tempValue = panel1Select.value;
    panel1Select.value = panel2Select.value;
    panel2Select.value = tempValue;
    
    updatePanelTitles();
    
    // If there's a current query, refresh the results
    const currentQuery = mainSearchInput.value.trim();
    if (currentQuery) {
        const encodedQuery = encodeURIComponent(currentQuery);
        updatePanel(1, panel1Select.value, encodedQuery, currentQuery);
        updatePanel(2, panel2Select.value, encodedQuery, currentQuery);
    }
}

// Apply a preset configuration of engines
function applyPreset(presetName) {
    switch(presetName) {
        case 'general':
            panel1Select.value = 'google';
            panel2Select.value = 'bing';
            panel3Select.value = 'duckduckgo';
            break;
        case 'privacy':
            panel1Select.value = 'startpage';
            panel2Select.value = 'brave';
            panel3Select.value = 'mojeek';
            break;
        case 'academic':
            panel1Select.value = 'scholar';
            panel2Select.value = 'pubmed';
            panel3Select.value = 'wolfram';
            break;
    }
    updatePanelTitles();
}

// Event Listeners
searchButton.addEventListener('click', performSearch);
mainSearchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

panel1Select.addEventListener('change', updatePanelTitles);
panel2Select.addEventListener('change', updatePanelTitles);
panel3Select.addEventListener('change', updatePanelTitles);

swapPanelsBtn.addEventListener('click', swapPanels);

presetButtons.forEach(button => {
    button.addEventListener('click', function() {
        const preset = this.getAttribute('data-preset');
        applyPreset(preset);
        mainSearchInput.focus();
    });
});

// Handle iframe loading errors (e.g., site blocks iframe embedding)
const iframes = [resultFrame1, resultFrame2, resultFrame3];
iframes.forEach((iframe, index) => {
    iframe.addEventListener('load', function() {
        // Check if the iframe loaded successfully or shows an error
        try {
            // This will fail if the iframe is cross-origin and blocked
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            console.log(`Panel ${index + 1} loaded successfully.`);
        } catch (error) {
            console.warn(`Panel ${index + 1} may be blocked from embedding. Users can still use the "Open Directly" link.`);
        }
    });
});
