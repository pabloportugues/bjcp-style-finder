#!/bin/bash
# Initialize directories
mkdir -p src/data src/components src/hooks src/styles

# Clear default App.css and index.css content but keep files
echo "" > src/App.css
echo "" > src/index.css

# Remove default assets if they exist
rm -f src/assets/react.svg
