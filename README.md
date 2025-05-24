# IoT Device Monitoring SPA

A Single Page Application for monitoring IoT devices built with React, TypeScript, and Webpack.

## Tech Stack

- React 18+
- TypeScript 5+
- Webpack 5+
- Zustand for state management
- CSS Modules
- anime.js for animations
- React Hook Form + yup for forms
- Recharts for charts
- ESLint (Airbnb) + Prettier

## Features

- Authentication system with JWT
- Role-based access (guest and owner)
- Device monitoring dashboard
- Interactive charts for device parameters
- Responsive design
- Light/dark theme
- Animated UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/iot-monitoring.git
cd iot-monitoring
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Start the development server
\`\`\`bash
npm start
\`\`\`

4. Start the mock API server
\`\`\`bash
npm run mock-api
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Login Credentials

- Owner: `owner@example.com` / `password123`
- Guest: `guest@example.com` / `guest123`

## Project Structure

\`\`\`
src/
├── api/          # API client and services
├── animations/   # Animation utilities
├── assets/       # Static assets
├── components/   # Reusable components
├── hooks/        # Custom React hooks
├── pages/        # Application pages
├── stores/       # Zustand state stores
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
\`\`\`

## Building for Production

\`\`\`bash
npm run build
\`\`\`

This will create a `dist` folder with the production build of your application.
