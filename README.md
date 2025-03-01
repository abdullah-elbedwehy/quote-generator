# Smart Quote Generator

A web application that generates and displays inspiring quotes with elegant animations and styling.

## Features

- Dynamic quote generation and display
- Animated quote cards with physics effects
- Clean and modern user interface
- CSV data integration for quote storage

## Project Structure

```
smart-quote-generator/
├── public/
│   └── data.csv         # Quote data storage
├── src/
│   ├── components/
│   │   └── QuoteCard.js # Quote display component
│   ├── physics/
│   │   └── engine.js    # Physics animation engine
│   ├── styles/
│   │   └── main.css     # Global styles
│   ├── main.js          # Application entry point
│   └── quotes_data.js   # Quote data management
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Technology Stack

- Vite - Build tool and development server
- React - UI framework
- CSS3 - Styling
- Physics engine for animations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server address shown in the terminal

## Development

This project uses Vite for fast development and building. The main components are:

- `QuoteCard.js` - Handles the display and animation of quotes
- `quotes_data.js` - Manages quote data and generation
- `engine.js` - Controls physics-based animations
- `main.css` - Contains global styles and animations

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.