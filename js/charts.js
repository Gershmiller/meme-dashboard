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
    const container = document.getElementById('trend-chart').parentElement;
    if (!container) return;
    
    // Clear existing chart
    container.innerHTML = '';
    
    // Calculate metrics
    const avgUpvotes = Math.round(memes.reduce((sum, meme) => sum + meme.ups, 0) / memes.length);
    
    // Count subreddits
    const subredditCounts = {};
    memes.forEach(meme => {
        subredditCounts[meme.subreddit] = (subredditCounts[meme.subreddit] || 0) + 1;
    });
    const mostActiveSubreddit = Object.entries(subredditCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
    
    // Get top meme
    const topMeme = [...memes].sort((a, b) => b.ups - a.ups)[0];
    
    // Create metric cards
    container.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <div class="card h-100 bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-subtitle mb-2 text-muted">Average Upvotes</h6>
                        <h3 class="card-title">${avgUpvotes.toLocaleString()}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card h-100 bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-subtitle mb-2 text-muted">Most Active Subreddit</h6>
                        <h3 class="card-title">r/${mostActiveSubreddit}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <div class="card h-100 bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-subtitle mb-2 text-muted">Top Meme</h6>
                        <h5 class="card-title">${topMeme.title}</h5>
                        <p class="mb-0">${topMeme.ups.toLocaleString()} upvotes</p>
                    </div>
                </div>
            </div>
        </div>
    `;
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
