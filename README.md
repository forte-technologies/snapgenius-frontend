# snapGenius - AI-Powered Image Analysis PWA

SnapGenius is a Progressive Web Application (PWA) that empowers users to upload unlimited images and documents. These uploads are converted into vector embeddings using OpenAI's embedding model, creating a searchable knowledge base.
The application features a retrieval-augmented generation chatbot. When users submit queries, the backend performs a similarity search against their uploaded content, retrieving the 5-6 most relevant documents or images as context for generating accurate, personalized responses.
This approach allows users to effectively interact with large volumes of their own data, as the system intelligently selects only the most relevant information needed to answer each specific query.

app can be used and downloaded at https://snapgenius.app/

## Technology Stack

- **Frontend**: React with Vite
- **Backend**: Spring Boot
- **HTTP Client**: Axios
- **Authentication**: OAuth 2.0 with JWT tokens
- **PWA Support**: vite-plugin-pwa

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
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file in the root directory with:
```
VITE_API_URL=your_backend_api_url (https://github.com/forte-technologies/snapgenius-server)
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

The application can be deployed to any static hosting service like Vercel, or Netlify.

```bash
npm run build
# Deploy the contents of the dist/ directory
```

