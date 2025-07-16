# Know-It-All Game

A competitive trivia ranking game where players bid on how many cards they can rank correctly in various categories.

## Quick Start - Local Deployment

### Option 1: Python (Recommended)
```bash
# Navigate to the project directory
cd /home/randycass/projects/know-it-all

# Start the server
./start-server.sh

# Or run directly:
python3 -m http.server 8000
```

### Option 2: Node.js
```bash
# Navigate to the project directory
cd /home/randycass/projects/know-it-all

# Start the server
node server.js
```

### Option 3: Using any static web server
The game is a static website and can be served by any web server. Simply serve the files from the project directory.

## Accessing the Game

Once the server is running, open your web browser and navigate to:
```
http://localhost:8000
```

## Game Files

- `index.html` - Main game interface
- `game.js` - Game logic and functionality
- `data.js` - Game data (countries and movies)
- `styles.css` - Game styling
- `game-rules.pdf` - Official game rules

## Features

- **Multiple Categories**: Countries and Movies with various ranking challenges
- **Competitive Bidding**: Players bid on how many cards they can rank correctly
- **Blocking Tokens**: Strategic gameplay with blocking mechanics
- **Statistics Tracking**: Comprehensive game statistics
- **Mobile-First Design**: Responsive design for all devices

## Stopping the Server

Press `Ctrl+C` in the terminal to stop the server.

## Production Deployment

For production deployment, the files in the `outrank-deploy/` directory are ready to be served by any static web hosting service.