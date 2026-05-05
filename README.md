# Shab-e-Firaq (شبِ فراق)

A modern, high-fidelity platform dedicated to Urdu literature. Built for readers who appreciate the art of storytelling and writers who demand a premium publishing experience.

## Overview

Shab-e-Firaq is a specialized web application tailored for the Urdu-speaking community. It combines a sophisticated "Bold Typography" design language with a robust backend to provide an immersive reading environment.

### Key Features

- **Premium Typography**: Integration of Noto Nastaliq Urdu for a native, elegant reading experience.
- **Immersive Reader**: Dark-themed reading interface designed to reduce eye strain during long sessions.
- **Writer Dashboard**: Comprehensive tools for authors to manage drafts, publish chapters, and track engagement.
- **Dynamic Library**: Categorized novel discovery (Romantic, Historical, Mystery, etc.) with real-time filtering.
- **Social Integration**: Bookmark system, likes, and ratings to foster community interaction.
- **Firebase Powered**: Secure Google and Email authentication with Firestore real-time synchronization.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4.0
- **Animation**: Motion (Framer Motion)
- **Backend**: Firebase (Authentication, Firestore)
- **Icons**: Lucide React

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

The project follows a modular React architecture with centralized Firebase configuration and role-based access control via Firestore Security Rules.

- `/src/lib`: Core Firebase and utility configurations.
- `/src/contexts`: Global state management for authentication.
- `/src/pages`: Feature-specific page components.
- `/src/components`: Atomic UI components.

---
*Created with a focus on Urdu literary preservation and modern web standards.*
