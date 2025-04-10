/**
 * Main application logic for the Meme Trend Dashboard
 */

// Global variables
let allMemes = [];
let filteredMemes = [];
let currentSubreddit = 'memes';
let currentCount = 10;
let currentSort = 'ups';
let currentFormat = 'all';

// DOM elements
const loadMemesButton = document.getElementById('load-memes');
const themeToggle = document.getElementById('theme-toggle');
const subredditFilter = document.getElementById('subreddit-filter');
const countFilter = document.getElementById('count-filter');
const galleryViewButton = document.getElementById('gallery-view-btn');
const listViewButton = document.getElementById('list-view-btn');
const exportCsvButton = document.getElementById('export-csv');
const takeScreenshotButton = document.getElementById('take-screenshot');

/**
 * Initialize the application
 */
function initApp() {
    console.log("Initializing app...");
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadMemeData();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Load memes button
    if (loadMemesButton) {
        loadMemesButton.addEventListener('click', () => loadMemeData());
    }
    
    // Filters
    if (subredditFilter) {
        subredditFilter.addEventListener('change', handleFilterChange);
    }
    
    if (countFilter) {
        countFilter.addEventListener('change', handleFilterChange);
    }
    
    // View toggle buttons
    if (galleryViewButton) {
        galleryViewButton.addEventListener('click', () => toggleGalleryView('grid'));
    }
    
    if (listViewButton) {
        listViewButton.addEventListener('click', () => toggleGalleryView('list'));
    }
    
    // Export buttons
    if (exportCsvButton) {
        exportCsvButton.addEventListener('click', exportToCSV);
    }
    
    if (takeScreenshotButton) {
        takeScreenshotButton.addEventListener('click', () => {
            console.log("Screenshot button clicked");
            alert("Screenshot feature would capture the current view");
        });
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const themeStylesheet = document.getElementById('theme-stylesheet');
    if (themeStylesheet) {
        const isDarkMode = !themeStylesheet.disabled;
        themeStylesheet.disabled = isDarkMode;
        updateThemeToggleIcon(isDarkMode);
    }
}

/**
 * Update theme toggle icon based on current theme
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function updateThemeToggleIcon(isDarkMode) {
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (icon) {
        if (isDarkMode) {
            icon.classList.remove('bi-sun');
            icon.classList.add('bi-moon');
        } else {
            icon.classList.remove('bi-moon');
            icon.classList.add('bi-sun');
        }
    }
}

/**
 * Handle filter changes
 */
function handleFilterChange() {
    if (subredditFilter) {
        currentSubreddit = subredditFilter.value;
    }
    
    if (countFilter) {
        currentCount = parseInt(countFilter.value);
    }
}

/**
 * Toggle between grid and list view for gallery
 * @param {string} mode - View mode ('grid' or 'list')
 */
function toggleGalleryView(mode) {
    const galleryContainer = document.getElementById('meme-gallery');
    if (!galleryContainer) return;
    
    if (mode === 'list') {
        galleryContainer.classList.remove('row-cols-md-3', 'row-cols-lg-4');
        galleryContainer.classList.add('row-cols-1');
        
        if (listViewButton && galleryViewButton) {
            galleryViewButton.classList.remove('active');
            listViewButton.classList.add('active');
        }
    } else {
        galleryContainer.classList.remove('row-cols-1');
        galleryContainer.classList.add('row-cols-md-3', 'row-cols-lg-4');
        
        if (listViewButton && galleryViewButton) {
            listViewButton.classList.remove('active');
            galleryViewButton.classList.add('active');
        }
    }
}

/**
 * Load meme data
 */
async function loadMemeData() {
    try {
        const data = await fetchMemes(currentSubreddit, currentCount);
        
        if (data && data.memes && data.memes.length > 0) {
            allMemes = data.memes;
            
            // Apply filters and sort
            applyFiltersAndSort();
            
            // Update dashboard
            updateDashboard();
        }
    } catch (error) {
        console.error('Error loading meme data:', error);
    }
}

/**
 * Apply filters and sort to meme data
 */
function applyFiltersAndSort() {
    // Apply format filter
    filteredMemes = [...allMemes];
    
    // Apply sort
    filteredMemes.sort((a, b) => b.ups - a.ups);
}

/**
 * Update dashboard with current data
 */
function updateDashboard() {
    console.log("Updating dashboard with", filteredMemes.length, "memes");
    
    // Update gallery
    populateMemeGallery(filteredMemes);
    
    // Update trend spotlight
    populateTrendSpotlight(filteredMemes);
    
    // Update charts if they exist
    if (typeof updateTrendChart === 'function') {
        updateTrendChart(filteredMemes);
    }
    
    if (typeof updateFormatChart === 'function') {
        updateFormatChart(filteredMemes);
    }
    
    if (typeof updateSentimentChart === 'function') {
        updateSentimentChart(filteredMemes);
    }
    
    // Update popularity scores
    populatePopularityScores(filteredMemes);
}

/**
 * Populate meme gallery with filtered memes
 * @param {Array} memes - Array of meme objects
 */
function populateMemeGallery(memes) {
    const galleryContainer = document.getElementById('meme-gallery');
    if (!galleryContainer) return;
    
    galleryContainer.innerHTML = '';
    
    if (memes.length === 0) {
        galleryContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">No memes found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    memes.forEach(meme => {
        const memeCard = document.createElement('div');
        memeCard.className = 'col meme-item mb-4';
        
        memeCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${meme.url}" class="card-img-top gallery-img" alt="${meme.title}" onerror="this.src='https://via.placeholder.com/400x300.png?text=Image+Not+Available'">
                <div class="card-body">
                    <h5 class="card-title">${meme.title}</h5>
                    <p class="card-text">
                        <small class="text-muted">r/${meme.subreddit} • ${meme.ups} upvotes</small>
                    </p>
                </div>
            </div>
        `;
        
        memeCard.addEventListener('click', ()  => {
            showMemeModal(meme);
        });
        
        galleryContainer.appendChild(memeCard);
    });
}

/**
 * Populate trend spotlight with top memes
 * @param {Array} memes - Array of meme objects
 */
function populateTrendSpotlight(memes) {
    const spotlightContainer = document.getElementById('trend-spotlight');
    if (!spotlightContainer) return;
    
    spotlightContainer.innerHTML = '';
    
    // Get top 3 memes
    const topMemes = memes.slice(0, 3);
    
    topMemes.forEach(meme => {
        const memeCol = document.createElement('div');
        memeCol.className = 'col-md-4 mb-3';
        
        memeCol.innerHTML = `
            <div class="card h-100">
                <img src="${meme.url}" class="card-img-top spotlight-img" alt="${meme.title}" onerror="this.src='https://via.placeholder.com/400x300.png?text=Image+Not+Available'">
                <div class="card-body">
                    <h6 class="card-title">${meme.title}</h6>
                    <p class="card-text">
                        <small class="text-muted">r/${meme.subreddit} • ${meme.ups} upvotes</small>
                    </p>
                </div>
            </div>
        `;
        
        spotlightContainer.appendChild(memeCol) ;
    });
}

/**
 * Populate popularity scores
 * @param {Array} memes - Array of meme objects
 */
function populatePopularityScores(memes) {
    const scoresContainer = document.getElementById('popularity-scores');
    if (!scoresContainer) return;
    
    scoresContainer.innerHTML = '';
    
    // Get top 5 memes by upvotes
    const topMemes = memes.slice(0, 5);
    
    // Create a list group
    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group';
    
    topMemes.forEach((meme, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Calculate a normalized score out of 100
        const maxUps = topMemes[0].ups;
        const normalizedScore = Math.round((meme.ups / maxUps) * 100);
        
        listItem.innerHTML = `
            <div>
                <span class="badge bg-primary rounded-pill me-2">${index + 1}</span>
                ${meme.title}
            </div>
            <span class="badge bg-success rounded-pill">${normalizedScore}</span>
        `;
        
        listGroup.appendChild(listItem);
    });
    
    scoresContainer.appendChild(listGroup);
}

/**
 * Show meme details in modal
 * @param {Object} meme - Meme object
 */
function showMemeModal(meme) {
    const modalTitle = document.getElementById('meme-modal-title');
    const modalBody = document.getElementById('meme-modal-body');
    
    if (!modalTitle || !modalBody) return;
    
    modalTitle.textContent = meme.title;
    
    modalBody.innerHTML = `
        <img src="${meme.url}" class="img-fluid mb-3" alt="${meme.title}" onerror="this.src='https://via.placeholder.com/400x300.png?text=Image+Not+Available'">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge bg-primary">r/${meme.subreddit}</span>
            <span><i class="bi bi-arrow-up-circle"></i> ${meme.ups} upvotes</span>
        </div>
        <p>Posted by u/${meme.author}</p>
        <a href="${meme.postLink}" target="_blank" class="btn btn-outline-primary">View on Reddit</a>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('meme-modal') );
    modal.show();
}

/**
 * Export meme data to CSV
 */
function exportToCSV() {
    if (filteredMemes.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Title,Subreddit,Author,Upvotes,URL\n';
    
    filteredMemes.forEach(meme => {
        csvContent += `"${meme.title.replace(/"/g, '""')}",`;
        csvContent += `${meme.subreddit},`;
        csvContent += `${meme.author},`;
        csvContent += `${meme.ups},`;
        csvContent += `${meme.url}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meme-data-${currentSubreddit}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
