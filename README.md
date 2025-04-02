# myGenius - AI-Powered Image Analysis PWA

myGenius is a Progressive Web Application (PWA) that allows users to upload images and chat with an AI assistant about the content of those images. The application features a modern iOS-inspired user interface, Google authentication, and is optimized for both desktop and mobile devices.

app can be used and downloaded at https://mygenius.netlify.app/

## Features

- **Progressive Web App**: Installable on devices with offline capabilities
- **Google Authentication**: Secure sign-in with Google OAuth 2.0
- **Image Upload**: Upload and manage images for AI analysis
- **AI Chat Interface**: Ask questions about uploaded images and receive AI-powered responses
- **Responsive Design**: iOS-inspired UI that works seamlessly on mobile and desktop
- **Modern UX**: Clean, intuitive interface with subtle animations and transitions

## Technology Stack

- **Frontend**: React 19 with Vite
- **Styling**: TailwindCSS v4 with custom iOS-inspired design
- **Routing**: React Router v7
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: OAuth 2.0 with JWT tokens
- **PWA Support**: vite-plugin-pwa

## Project Structure

```
mygenius-frontend/
├── public/                   # Static assets
│   ├── icons/                # App icons for various platforms
│   └── vite.svg              # Vite logo
├── src/                      # Source code
│   ├── assets/               # Images, fonts, and other static assets
│   ├── components/           # Reusable React components
│   ├── config/               # Configuration files
│   ├── contexts/             # React contexts for state management
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── App.jsx               # Main application component
│   ├── App.css               # Global CSS
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles and Tailwind imports
├── .env.development          # Development environment variables
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
└── package.json              # Project dependencies and scripts
```

## Key Files Explained

### Core Application Files

- **src/main.jsx**: Entry point that sets up React and the router
- **src/App.jsx**: Main component that handles routing and wraps the application with providers
- **src/index.css**: Global styles and Tailwind CSS imports
- **vite.config.js**: Vite configuration including PWA setup and development server settings

### Authentication

- **src/contexts/AuthProvider.jsx**: Manages authentication state, token handling, and user data
- **src/contexts/useAuth.js**: Custom hook for accessing auth context throughout the application
- **src/components/ProtectedRoute.jsx**: Route component that redirects unauthenticated users

### Pages

- **src/pages/Home.jsx**: Landing page with login functionality
- **src/pages/Dashboard.jsx**: Main authenticated user interface with profile info, image uploading, and chat

### Components

- **src/components/ImageUploader.jsx**: Component for uploading and managing images
- **src/components/ChatInterface.jsx**: Chat UI for interacting with the AI about uploaded images

### Configuration

- **src/config/api.js**: API endpoint definitions and Axios client configuration
- **.env.development**: Environment-specific variables

## PWA Configuration

The application is configured as a Progressive Web App with the following features:

- **Installability**: Users can install the app on their devices
- **Icons**: Multiple sizes for different platforms and use cases
- **Manifest**: Defined in vite.config.js for app metadata
- **Service Worker**: Auto-generated via vite-plugin-pwa

## API Integration

The frontend communicates with a Spring Boot backend API deployed on Heroku. Key endpoints include:

- **/api/auth/me**: Check authentication status
- **/oauth2/authorization/google**: Google OAuth login
- **/api/user/profile**: Get user profile data
- **/api/user/images**: Upload and manage images
- **/api/user/chat/rag**: Chat with AI about uploaded images using RAG (Retrieval Augmented Generation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Google OAuth credentials for authentication

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mygenius-frontend.git
cd mygenius-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file in the root directory with:
```
VITE_API_URL=your_backend_api_url
```

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Deployment

The application can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

```bash
npm run build
# Deploy the contents of the dist/ directory
```

## Browser Support

The application supports modern browsers including:
- Chrome/Edge (desktop and mobile)
- Safari (desktop and mobile)
- Firefox (desktop and mobile)

## License

[MIT License](LICENSE)

## Acknowledgements

- Design inspired by iOS user interface guidelines
- Icons from [Heroicons](https://heroicons.com/)
