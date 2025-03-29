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
const themeToggle = document.getElementById('theme-toggle');
const refreshButton = document.getElementById('refresh-data');
const subredditFilter = document.getElementById('subreddit-filter');
const countFilter = document.getElementById('count-filter');
const sortFilter = document.getElementById('sort-filter');
const formatFilter = document.getElementById('format-filter');
const loadMoreButton = document.getElementById('load-more');
const exportCsvButton = document.getElementById('export-csv');
const takeScreenshotButton = document.getElementById('take-screenshot');
const galleryViewButton = document.getElementById('gallery-view-btn');
const listViewButton = document.getElementById('list-view-btn');

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
    
    // Refresh button
    if (refreshButton) {
        refreshButton.addEventListener('click', () => loadMemeData());
    }
    
    // Filters
    if (subredditFilter) {
        subredditFilter.addEventListener('change', handleFilterChange);
    }
    
    if (countFilter) {
        countFilter.addEventListener('change', handleFilterChange);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', handleSortChange);
    }
    
    if (formatFilter) {
        formatFilter.addEventListener('change', handleFormatChange);
    }
    
    // Load more button
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreMemes);
    }
    
    // Export buttons
    if (exportCsvButton) {
        exportCsvButton.addEventListener('click', exportToCSV);
    }
    
    if (takeScreenshotButton) {
        takeScreenshotButton.addEventListener('click', () => {
            console.log("Screenshot button clicked");
            // Simplified version without actual screenshot functionality
            alert("Screenshot feature would capture the current view");
        });
    }
    
    // View toggle buttons
    if (galleryViewButton) {
        galleryViewButton.addEventListener('click', () => toggleGalleryView('grid'));
    }
    
    if (listViewButton) {
        listViewButton.addEventListener('click', () => toggleGalleryView('list'));
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
    
    // Reload data
    loadMemeData();
}

/**
 * Handle sort changes
 */
function handleSortChange() {
    if (sortFilter) {
        currentSort = sortFilter.value;
    }
    
    // Apply sort to existing data
    applyFiltersAndSort();
    updateDashboard();
}

/**
 * Handle format filter changes
 */
function handleFormatChange() {
    if (formatFilter) {
        currentFormat = formatFilter.value;
    }
    
    // Apply filter to existing data
    applyFiltersAndSort();
    updateDashboard();
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
 * Load more memes
 */
async function loadMoreMemes() {
    try {
        const data = await fetchMemes(currentSubreddit, currentCount);
        
        if (data && data.memes && data.memes.length > 0) {
            // Add new memes to existing collection
            allMemes = [...allMemes, ...data.memes];
            
            // Apply filters and sort
            applyFiltersAndSort();
            
            // Update dashboard
            updateDashboard();
        }
    } catch (error) {
        console.error('Error loading more memes:', error);
    }
}

/**
 * Apply filters and sort to meme data
 */
function applyFiltersAndSort() {
    // Apply format filter
    if (currentFormat === 'all') {
        filteredMemes = [...allMemes];
    } else {
        filteredMemes = allMemes.filter(meme => {
            const format = detectMemeFormat(meme.url);
            return format === currentFormat;
        });
    }
    
    // Apply sort
    if (currentSort === 'ups') {
        filteredMemes.sort((a, b) => b.ups - a.ups);
    }
}

/**
 * Update dashboard with current data
 */
function updateDashboard() {
    console.log("Updating dashboard with", filteredMemes.length, "memes");
    
    // Update gallery
    populateMemeGallery(filteredMemes);
    
    // Update other components if they exist
    if (typeof updateTrendChart === 'function') {
        updateTrendChart(filteredMemes);
    }
    
    if (typeof updateFormatChart === 'function') {
        updateFormatChart(filteredMemes);
    }
    
    if (typeof updateSentimentChart === 'function') {
        updateSentimentChart(filteredMemes);
    }
    
    if (typeof populateTrendSpotlight === 'function') {
        populateTrendSpotlight(filteredMemes);
    }
    
    if (typeof populatePopularityScores === 'function') {
        populatePopularityScores(filteredMemes);
    }
}

/**
 * Populate meme gallery with filtered memes
 * @param {Array} memes - Array of meme objects
 * @param {boolean} append - Whether to append to existing gallery
 */
function populateMemeGallery(memes, append = false) {
    const galleryContainer = document.getElementById('meme-gallery');
    if (!galleryContainer) return;
    
    if (!append) {
        galleryContainer.innerHTML = '';
    }
    
    memes.forEach(meme => {
        const memeCard = document.createElement('div');
        memeCard.className = 'col meme-item mb-4';
        
        memeCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${meme.url}" class="card-img-top gallery-img" alt="${meme.title}">
                <div class="card-body">
                    <h5 class="card-title">${meme.title}</h5>
                    <p class="card-text">
                        <small class="text-muted">r/${meme.subreddit} • ${meme.ups} upvotes</small>
                    </p>
                </div>
            </div>
        `;
        
        memeCard.addEventListener('click', () => {
            showMemeModal(meme);
        });
        
        galleryContainer.appendChild(memeCard);
    });
    
    if (memes.length === 0) {
        galleryContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">No memes found matching your criteria.</p>
            </div>
        `;
    }
}

/**
 * Show meme details in modal
 * @param {Object} meme - Meme object
 */
function showMemeModal(meme) {
    const modalTitle = document.getElementById('meme-modal-title');
    const modalBody = document.getElementById('meme-modal-body');
    const modal = new bootstrap.Modal(document.getElementById('meme-modal'));
    
    if (!modalTitle || !modalBody) return;
    
    modalTitle.textContent = meme.title;
    
    modalBody.innerHTML = `
        <img src="${meme.url}" class="img-fluid mb-3" alt="${meme.title}">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge bg-primary">r/${meme.subreddit}</span>
            <span><i class="bi bi-arrow-up-circle"></i> ${meme.ups} upvotes</span>
        </div>
        <p>Posted by u/${meme.author}</p>
        <a href="${meme.postLink}" target="_blank" class="btn btn-outline-primary">View on Reddit</a>
    `;
    
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
    
    if (typeof convertToCSV !== 'function' || typeof downloadCSV !== 'function') {
        alert('Export functionality not available');
        return;
    }
    
    const csvContent = convertToCSV(filteredMemes);
    const filename = `meme-data-${currentSubreddit}-${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(csvContent, filename);
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
        return 'image'; // Default to image
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
