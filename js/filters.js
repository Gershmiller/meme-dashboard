/**
 * Filter functions for the Meme Trend Dashboard
 */

/**
 * Apply filters to meme data
 * @param {Array} memes - Array of meme objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered memes
 */
function filterMemes(memes, filters) {
    if (!memes || memes.length === 0) return [];
    
    let result = [...memes];
    
    // Filter by format
    if (filters.format && filters.format !== 'all') {
        result = result.filter(meme => {
            const format = detectMemeFormat(meme.url);
            return format === filters.format;
        });
    }
    
    // Filter by NSFW
    if (filters.nsfw === false) {
        result = result.filter(meme => !meme.nsfw);
    }
    
    // Filter by subreddit (if multiple subreddits in data)
    if (filters.subreddit && filters.subreddit !== 'all') {
        result = result.filter(meme => meme.subreddit === filters.subreddit);
    }
    
    return result;
}

/**
 * Sort memes by specified criteria
 * @param {Array} memes - Array of meme objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted memes
 */
function sortMemes(memes, sortBy) {
    if (!memes || memes.length === 0) return [];
    
    const result = [...memes];
    
    switch (sortBy) {
        case 'ups':
            return result.sort((a, b) => b.ups - a.ups);
        case 'date':
            // Note: The API doesn't provide creation date, so this is a placeholder
            // In a real implementation, we would sort by date if available
            return result.sort((a, b) => b.ups - a.ups);
        default:
            return result;
    }
}

/**
 * Group memes by category
 * @param {Array} memes - Array of meme objects
 * @param {string} groupBy - Grouping criteria
 * @returns {Object} - Grouped memes
 */
function groupMemes(memes, groupBy) {
    if (!memes || memes.length === 0) return {};
    
    const result = {};
    
    switch (groupBy) {
        case 'subreddit':
            memes.forEach(meme => {
                if (!result[meme.subreddit]) {
                    result[meme.subreddit] = [];
                }
                result[meme.subreddit].push(meme);
            });
            break;
        case 'format':
            memes.forEach(meme => {
                const format = detectMemeFormat(meme.url);
                if (!result[format]) {
                    result[format] = [];
                }
                result[format].push(meme);
            });
            break;
        case 'sentiment':
            memes.forEach(meme => {
                const sentiment = analyzeSentiment(meme.title);
                if (!result[sentiment]) {
                    result[sentiment] = [];
                }
                result[sentiment].push(meme);
            });
            break;
        default:
            result.all = memes;
    }
    
    return result;
}

/**
 * Search memes by keyword
 * @param {Array} memes - Array of meme objects
 * @param {string} keyword - Search keyword
 * @returns {Array} - Matching memes
 */
function searchMemes(memes, keyword) {
    if (!memes || memes.length === 0 || !keyword) return [];
    
    const searchTerm = keyword.toLowerCase();
    
    return memes.filter(meme => {
        const title = meme.title.toLowerCase();
        const author = meme.author.toLowerCase();
        const subreddit = meme.subreddit.toLowerCase();
        
        return title.includes(searchTerm) || 
               author.includes(searchTerm) || 
               subreddit.includes(searchTerm);
    });
}
