/**
 * Utility functions for the Meme Trend Dashboard
 */

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
function truncateText(text, length = 50) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

/**
 * Get random color
 * @returns {string} - Random color in rgba format
 */
function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

/**
 * Get time ago string
 * @param {Date} date - Date object
 * @returns {string} - Time ago string
 */
function getTimeAgo(date) {
    if (!date) return '';
    
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + ' years ago';
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + ' months ago';
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + ' days ago';
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + ' hours ago';
    }
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + ' minutes ago';
    }
    
    return Math.floor(seconds) + ' seconds ago';
}
