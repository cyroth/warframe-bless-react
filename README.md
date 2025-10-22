# Warframe Bless Helper - React Version

AI Experiment

Refactored from my python [blessing app](https://github.com/cyroth/warframe)

A React application that generates blessing messages for Warframe relays
## Features

- Generate bot commands for blessing coordination
- Create squad messages with role assignments
- Generate whisper messages for individual players
- Roll call and thank you messages
- Dark/Light theme toggle
- Copy to clipboard functionality
- Responsive Bootstrap UI

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

1. Select your region, relay name, and instance
2. Enter usernames for each blessing type you need
3. Optionally add a backup player
4. Click "Generate Messages" to create all the necessary text
5. Use the copy buttons to copy individual messages to your clipboard

## Build

To create a production build:
```bash
npm run build
```