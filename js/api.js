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
/**
 * Fetch memes from the Meme API with fallback to sample data
 * @param {string} subreddit - Subreddit to fetch memes from
 * @param {number} count - Number of memes to fetch
 * @returns {Promise} - Promise that resolves to meme data
 */
async function fetchMemes(subreddit = 'memes', count = 10) {
    try {
        showLoading(true);
        hideError();
        
        // Try to fetch from real API first
        try {
            // Add CORS proxy to the URL
            const corsProxy = 'https://corsproxy.io/?';
            const url = `${corsProxy}${API_ENDPOINTS.MEME_API}/${subreddit}/${count}`;
            const response = await fetch(url) ;
            
            if (response.ok) {
                const data = await response.json();
                
                // Check if we actually got memes back
                if (data.memes && data.memes.length > 0) {
                    showLoading(false);
                    showStatus(`Successfully loaded ${data.memes.length} memes from Reddit`);
                    return data;
                }
            }
            // If we get here, the API request failed or returned no memes
            throw new Error('API request failed or returned no memes');
        } catch (apiError) {
            console.log('API request failed, falling back to sample data:', apiError);
            
            // Fall back to sample data
            const response = await fetch('sample-memes.json');
            
            if (!response.ok) {
                throw new Error(`Failed to load sample data: ${response.status}`);
            }
            
            const allData = await response.json();
            
            // Filter by subreddit if needed
            let filteredMemes = allData.memes;
            if (subreddit !== 'all') {
                filteredMemes = allData.memes.filter(meme => 
                    meme.subreddit.toLowerCase() === subreddit.toLowerCase()
                );
                
                // If no memes match the subreddit, return all memes
                if (filteredMemes.length === 0) {
                    filteredMemes = allData.memes;
                }
            }
            
            // Limit to requested count
            const limitedMemes = filteredMemes.slice(0, count);
            
            const data = {
                memes: limitedMemes
            };
            
            showLoading(false);
            showStatus(`Using sample memes (API unavailable)`);
            return data;
        }
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
/**
 * Show status message
 * @param {string} message - Status message to display
 */
function showStatus(message) {
    const statusAlert = document.getElementById('status-indicator');
    const statusMessage = document.getElementById('status-message');
    
    statusMessage.textContent = message;
    statusAlert.classList.remove('d-none');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        statusAlert.classList.add('d-none');
    }, 3000);
}

/**
 * Hide status message
 */
function hideStatus() {
    const statusAlert = document.getElementById('status-indicator');
    statusAlert.classList.add('d-none');
}
