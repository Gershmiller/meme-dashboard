/**
 * Chart and visualization functions for the Meme Trend Dashboard
 * Handles creating and updating charts and visualizations
 */

// Chart color palette
const CHART_COLORS = {
    primary: 'rgba(13, 110, 253, 0.7)',
    secondary: 'rgba(108, 117, 125, 0.7)',
    success: 'rgba(25, 135, 84, 0.7)',
    danger: 'rgba(220, 53, 69, 0.7)',
    warning: 'rgba(255, 193, 7, 0.7)',
    info: 'rgba(13, 202, 240, 0.7)',
    light: 'rgba(248, 249, 250, 0.7)',
    dark: 'rgba(33, 37, 41, 0.7)'
};

// Chart instances
let trendChart = null;
let formatChart = null;
let sentimentChart = null;

/**
 * Initialize all charts
 */
function initCharts() {
    initTrendChart();
    initFormatChart();
    initSentimentChart();
}

/**
 * Initialize trend chart
 */
function initTrendChart() {
    const ctx = document.getElementById('trend-chart').getContext('2d');
    
    // Create empty chart that will be populated with data later
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Popularity Score',
                data: [],
                backgroundColor: CHART_COLORS.primary,
                borderColor: CHART_COLORS.primary,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Popularity Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Memes'
                    }
                }
            }
        }
    });
}

/**
 * Initialize format distribution chart
 */
function initFormatChart() {
    const ctx = document.getElementById('format-chart').getContext('2d');
    
    // Create empty chart that will be populated with data later
    formatChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Image', 'GIF', 'Video'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    CHART_COLORS.primary,
                    CHART_COLORS.success,
                    CHART_COLORS.warning
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Initialize sentiment analysis chart
 */
function initSentimentChart() {
    const ctx = document.getElementById('sentiment-chart').getContext('2d');
    
    // Create empty chart that will be populated with data later
    sentimentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Humorous', 'Political', 'Absurdist', 'Wholesome', 'Other'],
            datasets: [{
                label: 'Sentiment Distribution',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    CHART_COLORS.primary,
                    CHART_COLORS.danger,
                    CHART_COLORS.warning,
                    CHART_COLORS.success,
                    CHART_COLORS.secondary
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            }
        }
    });
}

/**
 * Update trend chart with meme data
 * @param {Array} memes - Array of meme objects
 */
function updateTrendChart(memes) {
    if (!trendChart || !memes || memes.length === 0) return;
    
    // Sort memes by upvotes
    const sortedMemes = [...memes].sort((a, b) => b.ups - a.ups);
    
    // Take top 10 memes
    const topMemes = sortedMemes.slice(0, 10);
    
    // Extract labels and data
    const labels = topMemes.map(meme => truncateText(meme.title, 15));
    const data = topMemes.map(meme => meme.ups);
    
    // Update chart
    trendChart.data.labels = labels;
    trendChart.data.datasets[0].data = data;
    trendChart.update();
}

/**
 * Update format distribution chart with meme data
 * @param {Array} memes - Array of meme objects
 */
function updateFormatChart(memes) {
    if (!formatChart || !memes || memes.length === 0) return;
    
    // Count formats
    let imageCount = 0;
    let gifCount = 0;
    let videoCount = 0;
    
    memes.forEach(meme => {
        const url = meme.url.toLowerCase();
        if (url.endsWith('.gif')) {
            gifCount++;
        } else if (url.endsWith('.mp4') || url.endsWith('.webm')) {
            videoCount++;
        } else {
            imageCount++;
        }
    });
    
    // Update chart
    formatChart.data.datasets[0].data = [imageCount, gifCount, videoCount];
    formatChart.update();
}

/**
 * Update sentiment analysis chart with meme data
 * @param {Array} memes - Array of meme objects
 */
function updateSentimentChart(memes) {
    if (!sentimentChart || !memes || memes.length === 0) return;
    
    // Simple keyword-based sentiment analysis
    let humorous = 0;
    let political = 0;
    let absurdist = 0;
    let wholesome = 0;
    let other = 0;
    
    const humorKeywords = ['funny', 'lol', 'haha', 'joke', 'laugh', 'hilarious', 'comedy', 'humor'];
    const politicalKeywords = ['politics', 'president', 'government', 'election', 'vote', 'democrat', 'republican', 'biden', 'trump'];
    const absurdistKeywords = ['weird', 'strange', 'absurd', 'random', 'nonsense', 'surreal', 'bizarre'];
    const wholesomeKeywords = ['wholesome', 'kind', 'sweet', 'cute', 'heartwarming', 'positive', 'uplifting'];
    
    memes.forEach(meme => {
        const title = meme.title.toLowerCase();
        
        if (humorKeywords.some(keyword => title.includes(keyword))) {
            humorous++;
        } else if (politicalKeywords.some(keyword => title.includes(keyword))) {
            political++;
        } else if (absurdistKeywords.some(keyword => title.includes(keyword))) {
            absurdist++;
        } else if (wholesomeKeywords.some(keyword => title.includes(keyword))) {
            wholesome++;
        } else {
            other++;
        }
    });
    
    // Update chart
    sentimentChart.data.datasets[0].data = [humorous, political, absurdist, wholesome, other];
    sentimentChart.update();
}

/**
 * Populate trend spotlight with top memes
 * @param {Array} memes - Array of meme objects
 */
function populateTrendSpotlight(memes) {
    if (!memes || memes.length === 0) return;
    
    const spotlightContainer = document.getElementById('trend-spotlight');
    spotlightContainer.innerHTML = '';
    
    // Sort memes by upvotes and take top 3
    const topMemes = [...memes]
        .sort((a, b) => b.ups - a.ups)
        .slice(0, 3);
    
    // Create spotlight items
    topMemes.forEach(meme => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        
        col.innerHTML = `
            <div class="card h-100">
                <img src="${meme.url}" class="card-img-top spotlight-img" alt="${meme.title}" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+Not+Available';">
                <div class="card-body">
                    <h5 class="card-title">${truncateText(meme.title, 50)}</h5>
                    <p class="card-text">
                        <span class="badge bg-primary">${meme.subreddit}</span>
                        <span class="ms-2"><i class="bi bi-arrow-up"></i> ${meme.ups.toLocaleString()}</span>
                    </p>
                    <a href="${meme.postLink}" target="_blank" class="btn btn-sm btn-outline-primary">View on Reddit</a>
                </div>
            </div>
        `;
        
        spotlightContainer.appendChild(col);
    });
}

/**
 * Populate meme gallery with memes
 * @param {Array} memes - Array of meme objects
 * @param {boolean} append - Whether to append to existing gallery or replace
 */
function populateMemeGallery(memes, append = false) {
    if (!memes || memes.length === 0) return;
    
    const galleryContainer = document.getElementById('meme-gallery');
    
    if (!append) {
        galleryContainer.innerHTML = '';
    }
    
    // Create gallery items
    memes.forEach(meme => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3 meme-item';
        col.dataset.meme = JSON.stringify(meme);
        
        col.innerHTML = `
            <div class="card h-100">
                <img src="${meme.url}" class="card-img-top gallery-img" alt="${meme.title}" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+Not+Available';">
                <div class="card-body">
                    <h6 class="card-title">${truncateText(meme.title, 40)}</h6>
                    <p class="card-text small">
                        <span class="badge bg-primary">${meme.subreddit}</span>
                        <span class="ms-2"><i class="bi bi-arrow-up"></i> ${meme.ups.toLocaleString()}</span>
                    </p>
                </div>
            </div>
        `;
        
        galleryContainer.appendChild(col);
        
        // Add click event to open modal
        col.addEventListener('click', () => {
            openMemeModal(meme);
        });
    });
}

/**
 * Open meme modal with details
 * @param {Object} meme - Meme object
 */
function openMemeModal(meme) {
    const modal = new bootstrap.Modal(document.getElementById('meme-modal'));
    
    document.getElementById('meme-modal-title').textContent = meme.title;
    document.getElementById('meme-modal-image').src = meme.url;
    document.getElementById('meme-modal-subreddit').textContent = `r/${meme.subreddit}`;
    document.getElementById('meme-modal-author').textContent = `Posted by u/${meme.author}`;
    document.getElementById('meme-modal-ups').innerHTML = `<i class="bi bi-arrow-up"></i> ${meme.ups.toLocaleString()}`;
    document.getElementById('meme-modal-link').href = meme.postLink;
    
    modal.show();
}

/**
 * Populate popularity scores section
 * @param {Array} memes - Array of meme objects
 */
function populatePopularityScores(memes) {
    if (!memes || memes.length === 0) return;
    
    const scoresContainer = document.getElementById('popularity-scores');
    scoresContainer.innerHTML = '';
    
    // Sort memes by upvotes
    const sortedMemes = [...memes].sort((a, b) => b.ups - a.ups);
    
    // Take top 5 memes
    const topMemes = sortedMemes.slice(0, 5);
    
    // Create progress bars for each meme
    const maxUps = topMemes[0].ups;
    
    topMemes.forEach(meme => {
        const percentage = Math.round((meme.ups / maxUps) * 100);
        
        const scoreItem = document.createElement('div');
        scoreItem.className = 'mb-3';
        
        scoreItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span>${truncateText(meme.title, 30)}</span>
                <span class="badge bg-primary">${meme.ups.toLocaleString()}</span>
            </div>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${percentage}%" 
                     aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
        
        scoresContainer.appendChild(scoreItem);
    });
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
