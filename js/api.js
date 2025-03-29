/**
 * API functions for the Meme Trend Dashboard
 * Handles fetching data from meme APIs
 */

// API endpoints
const API_ENDPOINTS = {
    MEME_API: 'https://meme-api.com/gimme',
    MEMEGEN_API: 'https://api.memegen.link'
};

/**
 * Fetch memes from the Meme API
 * @param {string} subreddit - Subreddit to fetch memes from
 * @param {number} count - Number of memes to fetch
 * @returns {Promise} - Promise that resolves to meme data
 */
async function fetchMemes(subreddit = 'memes', count = 10) {
    try {
        showLoading(true);
        hideError();
        
        const url = `${API_ENDPOINTS.MEME_API}/${subreddit}/${count}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        showLoading(false);
        return data;
    } catch (error) {
        showLoading(false);
        showError(`Failed to fetch memes: ${error.message}`);
        console.error('Error fetching memes:', error);
        return { memes: [] };
    }
}

/**
 * Fetch a single random meme
 * @param {string} subreddit - Subreddit to fetch meme from
 * @returns {Promise} - Promise that resolves to meme data
 */
async function fetchRandomMeme(subreddit = 'memes') {
    try {
        const url = `${API_ENDPOINTS.MEME_API}/${subreddit}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching random meme:', error);
        return null;
    }
}

/**
 * Fetch available meme templates from Memegen API
 * @returns {Promise} - Promise that resolves to template data
 */
async function fetchMemeTemplates() {
    try {
        const url = `${API_ENDPOINTS.MEMEGEN_API}/templates`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching meme templates:', error);
        return [];
    }
}

/**
 * Generate a meme using the Memegen API
 * @param {string} template - Template ID
 * @param {string} topText - Top text
 * @param {string} bottomText - Bottom text
 * @returns {string} - URL to the generated meme
 */
function generateMeme(template, topText, bottomText) {
    // Replace spaces with underscores and handle special characters
    const formattedTop = formatMemeText(topText);
    const formattedBottom = formatMemeText(bottomText);
    
    return `${API_ENDPOINTS.MEMEGEN_API}/images/${template}/${formattedTop}/${formattedBottom}.png`;
}

/**
 * Format text for use in Memegen API URLs
 * @param {string} text - Text to format
 * @returns {string} - Formatted text
 */
function formatMemeText(text) {
    if (!text) return '_';
    
    // Replace spaces with underscores
    let formatted = text.replace(/ /g, '_');
    
    // Handle special characters
    formatted = formatted
        .replace(/\?/g, '~q')
        .replace(/&/g, '~a')
        .replace(/%/g, '~p')
        .replace(/#/g, '~h')
        .replace(/\//g, '~s')
        .replace(/\\/g, '~b')
        .replace(/</g, '~l')
        .replace(/>/g, '~g')
        .replace(/"/g, "''");
    
    return formatted;
}

/**
 * Show loading indicator
 * @param {boolean} isLoading - Whether to show or hide loading indicator
 */
function showLoading(isLoading) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (isLoading) {
        loadingIndicator.classList.remove('d-none');
    } else {
        loadingIndicator.classList.add('d-none');
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
}

/**
 * Hide error message
 */
function hideError() {
    const errorAlert = document.getElementById('error-alert');
    errorAlert.classList.add('d-none');
}
