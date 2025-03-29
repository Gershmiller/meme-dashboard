/**
 * API interaction for the Meme Trend Dashboard
 */

const API_ENDPOINTS = {
    MEME_API: 'https://meme-api.com/gimme',
    MEMEGEN_API: 'https://api.memegen.link'
};

/**
 * Fetch memes from Reddit with fallback to sample data
 * @param {string} subreddit - Subreddit to fetch memes from
 * @param {number} count - Number of memes to fetch
 * @returns {Promise} - Promise that resolves to meme data
 */
async function fetchMemes(subreddit = 'memes', count = 10) {
    try {
        showLoading(true);
        hideError();
        
        // Use Reddit's JSON API directly (no authentication needed for public data)
        const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${count}`;
        
        // Add a timestamp to prevent caching
        const nocacheUrl = `${url}&_=${new Date() .getTime()}`;
        
        const response = await fetch(nocacheUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const redditData = await response.json();
        
        // Transform Reddit data to our meme format
        const memes = redditData.data.children
            .filter(post => {
                // Filter for image posts only
                const url = post.data.url || '';
                return url.endsWith('.jpg') || url.endsWith('.jpeg') || 
                       url.endsWith('.png') || url.endsWith('.gif');
            })
            .map(post => ({
                postLink: `https://reddit.com${post.data.permalink}`,
                subreddit: post.data.subreddit,
                title: post.data.title,
                url: post.data.url,
                nsfw: post.data.over_18,
                author: post.data.author,
                ups: post.data.ups
            }) );
        
        if (memes.length === 0) {
            throw new Error('No image memes found in this subreddit. Try another one.');
        }
        
        const data = { memes };
        
        showLoading(false);
        showStatus(`Successfully loaded ${memes.length} memes from r/${subreddit}`);
        return data;
    } catch (error) {
        console.error('Error fetching memes:', error);
        showLoading(false);
        showError(`Failed to fetch memes: ${error.message}`);
        
        // Fall back to sample data if API fails
        const sampleData = {
            "memes": [
                {
                    "postLink": "https://reddit.com/r/memes/sample1",
                    "subreddit": "memes",
                    "title": "When you finally understand JavaScript",
                    "url": "https://via.placeholder.com/400x300.png?text=JavaScript+Meme",
                    "nsfw": false,
                    "author": "CodeMaster",
                    "ups": 5280
                },
                {
                    "postLink": "https://reddit.com/r/memes/sample2",
                    "subreddit": "memes",
                    "title": "Working from home be like",
                    "url": "https://via.placeholder.com/400x300.png?text=Work+From+Home+Meme",
                    "nsfw": false,
                    "author": "RemoteWorker",
                    "ups": 4720
                },
                {
                    "postLink": "https://reddit.com/r/dankmemes/sample3",
                    "subreddit": "dankmemes",
                    "title": "Every time I try to fix a bug",
                    "url": "https://via.placeholder.com/400x300.png?text=Bug+Fix+Meme",
                    "nsfw": false,
                    "author": "BugHunter",
                    "ups": 8340
                },
                {
                    "postLink": "https://reddit.com/r/ProgrammerHumor/sample4",
                    "subreddit": "ProgrammerHumor",
                    "title": "CSS positioning explained",
                    "url": "https://via.placeholder.com/400x300.png?text=CSS+Positioning+Meme",
                    "nsfw": false,
                    "author": "CSSWizard",
                    "ups": 6210
                },
                {
                    "postLink": "https://reddit.com/r/memes/sample5",
                    "subreddit": "memes",
                    "title": "When the code works on the first try",
                    "url": "https://via.placeholder.com/400x300.png?text=Working+Code+Meme",
                    "nsfw": false,
                    "author": "LuckyDev",
                    "ups": 9150
                }
            ]
        };
        
        // Filter by subreddit if needed
        let filteredMemes = sampleData.memes;
        if (subreddit !== 'all')  {
            filteredMemes = sampleData.memes.filter(meme => 
                meme.subreddit.toLowerCase() === subreddit.toLowerCase()
            );
            
            // If no memes match the subreddit, return all memes
            if (filteredMemes.length === 0) {
                filteredMemes = sampleData.memes;
            }
        }
        
        // Limit to requested count
        const limitedMemes = filteredMemes.slice(0, count);
        
        return { memes: limitedMemes };
    }
}

        
        // Filter by subreddit if needed
        let filteredMemes = sampleData.memes;
        if (subreddit !== 'all')  {
            filteredMemes = sampleData.memes.filter(meme => 
                meme.subreddit.toLowerCase() === subreddit.toLowerCase()
            );
            
            // If no memes match the subreddit, return all memes
            if (filteredMemes.length === 0) {
                filteredMemes = sampleData.memes;
            }
        }
        
        // Limit to requested count
        const limitedMemes = filteredMemes.slice(0, count);
        
        const data = {
            memes: limitedMemes
        };
        
        showLoading(false);
        showStatus(`Loaded ${limitedMemes.length} sample memes`);
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
        const data = await fetchMemes(subreddit, 1);
        return data.memes[0];
    } catch (error) {
        console.error('Error fetching random meme:', error);
        return null;
    }
}

/**
 * Show loading indicator
 * @param {boolean} isLoading - Whether loading is in progress
 */
function showLoading(isLoading) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        if (isLoading) {
            loadingIndicator.classList.remove('d-none');
        } else {
            loadingIndicator.classList.add('d-none');
        }
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    
    if (errorAlert && errorMessage) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('d-none');
    } else {
        console.error('Error:', message);
    }
}

/**
 * Hide error message
 */
function hideError() {
    const errorAlert = document.getElementById('error-alert');
    if (errorAlert) {
        errorAlert.classList.add('d-none');
    }
}

/**
 * Show status message
 * @param {string} message - Status message to display
 */
function showStatus(message) {
    const statusAlert = document.getElementById('status-indicator');
    const statusMessage = document.getElementById('status-message');
    
    if (statusAlert && statusMessage) {
        statusMessage.textContent = message;
        statusAlert.classList.remove('d-none');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusAlert.classList.add('d-none');
        }, 3000);
    } else {
        console.log('Status:', message);
    }
}

/**
 * Hide status message
 */
function hideStatus() {
    const statusAlert = document.getElementById('status-indicator');
    if (statusAlert) {
        statusAlert.classList.add('d-none');
    }
}
