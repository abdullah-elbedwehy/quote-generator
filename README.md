#  Quote

A web application that displays inspiring quotes with elegant animations and styling.


![Physics Quote Stack -03-01 (ZKYgHN6N)](https://github.com/user-attachments/assets/b1800e0e-d171-4ef0-906e-8ab8ffc689a7)

## Purpose  
The purpose of this project is to apply some of the things I have learned, such as integrating Matter.js and working with it!

## Features


- Animated quote cards with physics effects
- Clean and modern user interface
- CSV data integration for quote storage

## Project Structure

```
quote /
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
- `quotes_data.js` - Manages quote 
- `engine.js` - Controls physics-based animations
- `main.css` - Contains global styles and animations

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.
