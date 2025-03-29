/**
 * Filter functionality for the Meme Trend Dashboard
 */

/**
 * Apply format filter to memes
 * @param {Array} memes - Array of meme objects
 * @param {string} format - Format to filter by
 * @returns {Array} - Filtered memes
 */
function filterByFormat(memes, format) {
    if (!memes || !format || format === 'all') {
        return memes;
    }
    
    return memes.filter(meme => {
        const memeFormat = detectMemeFormat(meme.url);
        return memeFormat === format;
    });
}

/**
 * Apply subreddit filter to memes
 * @param {Array} memes - Array of meme objects
 * @param {string} subreddit - Subreddit to filter by
 * @returns {Array} - Filtered memes
 */
function filterBySubreddit(memes, subreddit) {
    if (!memes || !subreddit || subreddit === 'all') {
        return memes;
    }
    
    return memes.filter(meme => 
        meme.subreddit.toLowerCase() === subreddit.toLowerCase()
    );
}

/**
 * Sort memes by specified criteria
 * @param {Array} memes - Array of meme objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted memes
 */
function sortMemes(memes, sortBy) {
    if (!memes || !sortBy) {
        return memes;
    }
    
    const sortedMemes = [...memes];
    
    switch (sortBy) {
        case 'ups':
            sortedMemes.sort((a, b) => b.ups - a.ups);
            break;
        case 'title':
            sortedMemes.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'subreddit':
            sortedMemes.sort((a, b) => a.subreddit.localeCompare(b.subreddit));
            break;
        default:
            // Default sort by upvotes
            sortedMemes.sort((a, b) => b.ups - a.ups);
    }
    
    return sortedMemes;
}
