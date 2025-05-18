#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
git pull origin main
echo "Pulling latest changes from GitHub..."
echo "Copying new changes to server..."
# Copy the new changes to the server
echo "New changes copied to server !"

echo "Installing Dependencies..."
npm install --yes

echo "Creating Production Build..."
# For ReactJS VueJS and Nuxt JS
npm run build


echo "Deployment Finished!"