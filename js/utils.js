/**
 * Utility functions for the Meme Trend Dashboard
 */

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} - Formatted date
 */
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Convert meme data to CSV format
 * @param {Array} memes - Array of meme objects
 * @returns {string} - CSV data
 */
function convertToCSV(memes) {
    if (!memes || memes.length === 0) return '';
    
    // Define CSV headers
    const headers = ['Title', 'Subreddit', 'Author', 'Upvotes', 'URL', 'Post Link', 'NSFW', 'Spoiler'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    memes.forEach(meme => {
        // Escape quotes in title
        const safeTitle = meme.title.replace(/"/g, '""');
        
        const row = [
            `"${safeTitle}"`,
            meme.subreddit,
            meme.author,
            meme.ups,
            meme.url,
            meme.postLink,
            meme.nsfw,
            meme.spoiler
        ];
        
        csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
}

/**
 * Download data as CSV file
 * @param {string} csvContent - CSV content
 * @param {string} filename - Filename
 */
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Take screenshot of an element
 * @param {string} elementId - ID of element to screenshot
 * @param {string} filename - Filename
 */
async function takeScreenshot(elementId, filename) {
    try {
        const element = document.getElementById(elementId);
        if (!element) throw new Error('Element not found');
        
        const canvas = await html2canvas(element);
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error taking screenshot:', error);
        alert('Failed to take screenshot. Please try again.');
    }
}

/**
 * Save data to local storage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
}

/**
 * Load data from local storage
 * @param {string} key - Storage key
 * @returns {any} - Stored data or null if not found
 */
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from local storage:', error);
        return null;
    }
}

/**
 * Detect meme format from URL
 * @param {string} url - Meme URL
 * @returns {string} - Format (image, gif, video)
 */
function detectMemeFormat(url) {
    if (!url) return 'unknown';
    
    const lowercaseUrl = url.toLowerCase();
    
    if (lowercaseUrl.endsWith('.gif')) {
        return 'gif';
    } else if (lowercaseUrl.endsWith('.mp4') || lowercaseUrl.endsWith('.webm')) {
        return 'video';
    } else if (lowercaseUrl.endsWith('.jpg') || lowercaseUrl.endsWith('.jpeg') || 
               lowercaseUrl.endsWith('.png') || lowercaseUrl.endsWith('.webp')) {
        return 'image';
    } else {
        // Try to guess based on common patterns
        if (lowercaseUrl.includes('imgur') && !lowercaseUrl.includes('/a/')) {
            return 'image';
        } else {
            return 'unknown';
        }
    }
}

/**
 * Calculate popularity score based on upvotes and time
 * @param {number} ups - Upvote count
 * @param {Date} created - Creation date
 * @returns {number} - Popularity score
 */
function calculatePopularityScore(ups, created) {
    if (!ups) return 0;
    
    // If no creation date, just return upvotes
    if (!created) return ups;
    
    // Calculate time factor (newer posts get higher score)
    const now = new Date();
    const createdDate = new Date(created);
    const ageInHours = (now - createdDate) / (1000 * 60 * 60);
    
    // Simple decay formula: score = upvotes / (age in hours + 2)^1.5
    // This gives newer posts with same upvotes a higher score
    const timeFactor = Math.pow(ageInHours + 2, 1.5);
    
    return Math.round(ups / timeFactor);
}

/**
 * Simple sentiment analysis based on keywords
 * @param {string} title - Meme title
 * @returns {string} - Sentiment category
 */
function analyzeSentiment(title) {
    if (!title) return 'other';
    
    const lowercaseTitle = title.toLowerCase();
    
    const humorKeywords = ['funny', 'lol', 'haha', 'joke', 'laugh', 'hilarious', 'comedy', 'humor'];
    const politicalKeywords = ['politics', 'president', 'government', 'election', 'vote', 'democrat', 'republican', 'biden', 'trump'];
    const absurdistKeywords = ['weird', 'strange', 'absurd', 'random', 'nonsense', 'surreal', 'bizarre'];
    const wholesomeKeywords = ['wholesome', 'kind', 'sweet', 'cute', 'heartwarming', 'positive', 'uplifting'];
    
    if (humorKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
        return 'humorous';
    } else if (politicalKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
        return 'political';
    } else if (absurdistKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
        return 'absurdist';
    } else if (wholesomeKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
        return 'wholesome';
    } else {
        return 'other';
    }
}
