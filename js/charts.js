/**
 * Chart visualization for the Meme Trend Dashboard
 */

// Chart instances
let trendChart = null;
let formatChart = null;
let sentimentChart = null;

/**
 * Update trend chart with meme data
 * @param {Array} memes - Array of meme objects
 */
function updateTrendChart(memes) {
    const ctx = document.getElementById('trend-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (trendChart) {
        trendChart.destroy();
    }
    
    // Sort memes by upvotes (descending)
    const sortedMemes = [...memes].sort((a, b) => b.ups - a.ups);
    
    // Take top 5 memes
    const topMemes = sortedMemes.slice(0, 5);
    
    // Prepare data
    const labels = topMemes.map(meme => {
        // Truncate long titles
        return meme.title.length > 20 ? meme.title.substring(0, 20) + '...' : meme.title;
    });
    
    const data = topMemes.map(meme => meme.ups);
    
    // Create chart
    trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Upvotes',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Update format chart with meme data
 * @param {Array} memes - Array of meme objects
 */
function updateFormatChart(memes) {
    const ctx = document.getElementById('format-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (formatChart) {
        formatChart.destroy();
    }
    
    // Count memes by format
    const formatCounts = {
        'image': 0,
        'gif': 0,
        'video': 0
    };
    
    memes.forEach(meme => {
        const format = detectMemeFormat(meme.url);
        if (formatCounts[format] !== undefined) {
            formatCounts[format]++;
        }
    });
    
    // Prepare data
    const labels = Object.keys(formatCounts);
    const data = Object.values(formatCounts);
    
    // Create chart
    formatChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/**
 * Update sentiment chart with meme data
 * @param {Array} memes - Array of meme objects
 */
function updateSentimentChart(memes) {
    const ctx = document.getElementById('sentiment-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (sentimentChart) {
        sentimentChart.destroy();
    }
    
    // For demo purposes, generate random sentiment data
    const sentimentData = {
        'Positive': Math.floor(Math.random() * 50) + 30,
        'Neutral': Math.floor(Math.random() * 30) + 20,
        'Negative': Math.floor(Math.random() * 20) + 10
    };
    
    // Prepare data
    const labels = Object.keys(sentimentData);
    const data = Object.values(sentimentData);
    
    // Create chart
    sentimentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/**
 * Detect meme format from URL
 * @param {string} url - Meme URL
 * @returns {string} - Format (image, gif, video)
 */
function detectMemeFormat(url) {
    if (!url) return 'image';
    
    const lowercaseUrl = url.toLowerCase();
    
    if (lowercaseUrl.endsWith('.gif')) {
        return 'gif';
    } else if (lowercaseUrl.endsWith('.mp4') || lowercaseUrl.endsWith('.webm')) {
        return 'video';
    } else {
        return 'image';
    }
}
