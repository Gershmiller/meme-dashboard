# Meme Trend Dashboard - Simplified Architecture

## Overview
This document outlines the architecture for a simple HTML-based meme trend dashboard that uses free APIs to track and analyze viral meme trends across social media platforms. The dashboard will be designed to be hosted on GitHub Pages and will focus on providing insights for satirical cultural commentary.

## System Components

### 1. Frontend (Static HTML/CSS/JavaScript)
- Single-page application with responsive design
- Dark/light mode toggle
- Simple navigation between dashboard sections
- Client-side data processing and visualization
- Local storage for user preferences

### 2. Data Sources
- **Primary API**: [Meme_Api](https://github.com/D3vd/Meme_Api)
  - Endpoint: `https://meme-api.com/gimme`
  - Provides random memes from Reddit subreddits (memes, dankmemes, me_irl)
  - JSON response with title, URL, preview images, and metadata
  - Can specify subreddit and count parameters

- **Secondary API**: [Memegen](https://github.com/jacebrowning/memegen)
  - Endpoint: `https://api.memegen.link/`
  - Allows programmatic meme generation
  - Can be used to create custom memes based on trending templates

### 3. Data Flow
1. User loads the dashboard in browser
2. JavaScript fetches meme data from APIs
3. Data is processed and categorized client-side
4. Visualizations are rendered using lightweight charting libraries
5. User interactions trigger additional data fetching or filtering

### 4. Core Features

#### Trend Visualization
- Simple timeline display of popular memes
- Basic charts for trend visualization
- Format distribution visualization (image vs. video)

#### Analytics Features
- Simple popularity score calculation
- Basic platform comparison view
- Simple sentiment categorization

#### Meme Visualization
- Gallery view for meme content
- Trend spotlight for top memes
- One-click navigation to source content

#### Organization System
- Basic categorization system
- Simple tagging functionality
- Basic viewing options (format, platform, topic)

#### Export Functionality
- Screenshot or save functionality
- Basic data export to CSV

### 5. Technical Constraints
- All processing happens client-side (no backend server)
- Uses browser local storage for saving preferences
- Respects API rate limits (100 queries per minute for Reddit API)
- Maximum of 1000 items per retrieval from Reddit API

### 6. Attribution Requirements
- "Not Liz AI" attribution on all dashboard views
- Watermark/logo in bottom corner
- Attribution included in exported materials

## Implementation Approach

### Technologies
- HTML5/CSS3 for structure and styling
- Vanilla JavaScript for functionality
- [Chart.js](https://www.chartjs.org/) for simple visualizations
- [Bootstrap](https://getbootstrap.com/) for responsive layout

### File Structure
```
meme-dashboard/
├── index.html          # Main dashboard page
├── css/
│   ├── styles.css      # Custom styles
│   └── dark-mode.css   # Dark mode styles
├── js/
│   ├── app.js          # Main application logic
│   ├── api.js          # API interaction functions
│   ├── charts.js       # Visualization functions
│   ├── filters.js      # Data filtering functions
│   └── utils.js        # Utility functions
└── img/
    └── logo.png        # Not Liz AI logo
```

### Deployment
- Code will be placed in VSCode
- Repository will be created on GitHub
- Site will be deployed using GitHub Pages

## Limitations and Future Enhancements
- Limited to free API capabilities
- No real-time updates (manual refresh required)
- Basic analytics without advanced ML capabilities
- Future enhancements could include:
  - Additional data sources if free APIs become available
  - More sophisticated trend analysis
  - User accounts for saved preferences (would require backend)
