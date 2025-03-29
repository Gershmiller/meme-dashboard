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
    // Initialize charts
    initCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load saved preferences
    loadPreferences();
    
    // Load initial data
    loadMemeData();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Refresh button
    refreshButton.addEventListener('click', () => loadMemeData());
    
    // Filters
    subredditFilter.addEventListener('change', handleFilterChange);
    countFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleSortChange);
    formatFilter.addEventListener('change', handleFormatChange);
    
    // Load more button
    loadMoreButton.addEventListener('click', loadMoreMemes);
    
    // Export buttons
    exportCsvButton.addEventListener('click', exportToCSV);
    takeScreenshotButton.addEventListener('click', () => takeScreenshot('trending', 'meme-trends.png'));
    
    // View toggle buttons
    galleryViewButton.addEventListener('click', () => toggleGalleryView('grid'));
    listViewButton.addEventListener('click', () => toggleGalleryView('list'));
}

/**
 * Load saved preferences from local storage
 */
function loadPreferences() {
    // Theme preference
    const darkMode = loadFromLocalStorage('darkMode');
    if (darkMode) {
        document.getElementById('theme-stylesheet').disabled = !darkMode;
        updateThemeToggleIcon(darkMode);
    }
    
    // Filter preferences
    const savedSubreddit = loadFromLocalStorage('subreddit');
    if (savedSubreddit) {
        currentSubreddit = savedSubreddit;
        subredditFilter.value = savedSubreddit;
    }
    
    const savedCount = loadFromLocalStorage('count');
    if (savedCount) {
        currentCount = savedCount;
        countFilter.value = savedCount;
    }
    
    const savedSort = loadFromLocalStorage('sort');
    if (savedSort) {
        currentSort = savedSort;
        sortFilter.value = savedSort;
    }
    
    const savedFormat = loadFromLocalStorage('format');
    if (savedFormat) {
        currentFormat = savedFormat;
        formatFilter.value = savedFormat;
    }
    
    // View preference
    const viewMode = loadFromLocalStorage('viewMode') || 'grid';
    toggleGalleryView(viewMode, false);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const themeStylesheet = document.getElementById('theme-stylesheet');
    const isDarkMode = !themeStylesheet.disabled;
    
    themeStylesheet.disabled = isDarkMode;
    updateThemeToggleIcon(isDarkMode);
    
    // Save preference
    saveToLocalStorage('darkMode', isDarkMode);
}

/**
 * Update theme toggle icon based on current theme
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function updateThemeToggleIcon(isDarkMode) {
    const icon = themeToggle.querySelector('i');
    if (isDarkMode) {
        icon.classList.remove('bi-sun');
        icon.classList.add('bi-moon');
    } else {
        icon.classList.remove('bi-moon');
        icon.classList.add('bi-sun');
    }
}

/**
 * Handle filter changes
 */
function handleFilterChange() {
    currentSubreddit = subredditFilter.value;
    currentCount = parseInt(countFilter.value);
    
    // Save preferences
    saveToLocalStorage('subreddit', currentSubreddit);
    saveToLocalStorage('count', currentCount);
    
    // Reload data
    loadMemeData();
}

/**
 * Handle sort changes
 */
function handleSortChange() {
    currentSort = sortFilter.value;
    
    // Save preference
    saveToLocalStorage('sort', currentSort);
    
    // Apply sort to existing data
    applyFiltersAndSort();
    updateDashboard();
}

/**
 * Handle format filter changes
 */
function handleFormatChange() {
    currentFormat = formatFilter.value;
    
    // Save preference
    saveToLocalStorage('format', currentFormat);
    
    // Apply filter to existing data
    applyFiltersAndSort();
    updateDashboard();
}

/**
 * Toggle between grid and list view for gallery
 * @param {string} mode - View mode ('grid' or 'list')
 * @param {boolean} updateUI - Whether to update UI elements
 */
function toggleGalleryView(mode, updateUI = true) {
    const galleryContainer = document.getElementById('meme-gallery');
    
    if (mode === 'list') {
        galleryContainer.classList.remove('row-cols-md-3', 'row-cols-lg-4');
        galleryContainer.classList.add('row-cols-1');
        
        if (updateUI) {
            galleryViewButton.classList.remove('active');
            listViewButton.classList.add('active');
        }
    } else {
        galleryContainer.classList.remove('row-cols-1');
        galleryContainer.classList.add('row-cols-md-3', 'row-cols-lg-4');
        
        if (updateUI) {
            listViewButton.classList.remove('active');
            galleryViewButton.classList.add('active');
        }
    }
    
    // Save preference
    saveToLocalStorage('viewMode', mode);
}

/**
 * Load meme data from API
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
            const newMemes = data.memes.filter(newMeme => 
                !allMemes.some(existingMeme => existingMeme.postLink === newMeme.postLink)
            );
            
            allMemes = [...allMemes, ...newMemes];
            
            // Apply filters and sort
            applyFiltersAndSort();
            
            // Update gallery only (append mode)
            populateMemeGallery(filteredMemes, true);
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
    } else if (currentSort === 'date') {
        // Note: The API doesn't provide creation date, so this is a placeholder
        // In a real implementation, we would sort by date if available
        filteredMemes.sort((a, b) => b.ups - a.ups);
    }
}

/**
 * Update dashboard with current data
 */
function updateDashboard() {
    // Update charts
    updateTrendChart(filteredMemes);
    updateFormatChart(filteredMemes);
    updateSentimentChart(filteredMemes);
    
    // Update trend spotlight
    populateTrendSpotlight(filteredMemes);
    
    // Update popularity scores
    populatePopularityScores(filteredMemes);
    
    // Update gallery
    populateMemeGallery(filteredMemes);
}

/**
 * Export meme data to CSV
 */
function exportToCSV() {
    if (filteredMemes.length === 0) {
        alert('No data to export');
        return;
    }
    
    const csvContent = convertToCSV(filteredMemes);
    const filename = `meme-data-${currentSubreddit}-${getCurrentDate()}.csv`;
    
    downloadCSV(csvContent, filename);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
