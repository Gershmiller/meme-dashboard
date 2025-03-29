# Meme Trend Dashboard

A simple HTML-based dashboard for tracking and analyzing viral meme trends across social media platforms to inform satirical cultural commentary.

## Features

- **Trend Visualization**: Timeline graphs and format distribution charts
- **Analytics**: Popularity scores and sentiment analysis
- **Meme Gallery**: Interactive gallery view with grid and list modes
- **Filtering**: Filter by subreddit, count, sort order, and format
- **Export Options**: CSV export and screenshot functionality
- **Theme Toggle**: Light and dark mode support

## Getting Started

### Local Development

1. Clone this repository:
```
git clone https://github.com/yourusername/meme-dashboard.git
cd meme-dashboard
```

2. Open `index.html` in your browser or use a local server:
```
# Using Python's built-in server
python -m http.server
```

3. Visit `http://localhost:8000` in your browser

### Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Push this code to your repository:
```
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/meme-dashboard.git
git push -u origin main
```

3. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Select "main" branch as the source
   - Click Save

4. Your dashboard will be available at `https://yourusername.github.io/meme-dashboard/`

## API Usage

This dashboard uses the following free APIs:

- [Meme_Api](https://github.com/D3vd/Meme_Api): Provides random memes from Reddit subreddits
- [Memegen](https://github.com/jacebrowning/memegen): Allows for programmatic meme generation

## Customization

- Edit `index.html` to modify the dashboard structure
- Modify `css/styles.css` and `css/dark-mode.css` to change the appearance
- Update JavaScript files in the `js` directory to alter functionality

## Attribution

Created in collaboration with Not Liz AI

## License

MIT License
