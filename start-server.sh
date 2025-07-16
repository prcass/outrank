#!/bin/bash

echo "Starting Know-It-All Game Server..."
echo "Open your browser and navigate to: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server
python3 -m http.server 8000