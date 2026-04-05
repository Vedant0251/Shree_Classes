# Shree Classes Platform

## Overview
This platform consists of a Node.js backend and a React (Vite) frontend.

## Prerequisites
Before you begin setting up the project on a new device, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 16 or higher recommended)
- [Git](https://git-scm.com/)

## Step 1: Clone the Repository
Open your terminal or command prompt and run the following command to clone the project from GitHub onto your new device:

```sh
git clone <YOUR_GITHUB_REPO_URL>
cd Shree_Classes
```
*(Note: Replace `<YOUR_GITHUB_REPO_URL>` with the actual clone URL of this repository)*

## Step 2: Set up the Backend
The backend handles the API requests and uses an Express server.

1. Navigate to the backend directory:
   ```sh
   cd Shree_Academy/backend
   ```
2. Install the required Node.js dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   node server.js
   ```
   *The server should now be running on port 5000 (`http://localhost:5000`). Keep this terminal open.*

## Step 3: Set up the Frontend
The frontend is built with React and Vite. You'll need to open a **new terminal tab/window** for these steps.

1. Navigate to the frontend directory from the project root:
   ```sh
   cd Shree_Academy/frontend
   ```
2. Install the necessary frontend dependencies:
   ```sh
   npm install
   ```
3. Start the Vite development server:
   ```sh
   npm run dev
   ```
   *The console will provide you with a local URL (typically `http://localhost:5173/`). Open this URL in your browser to view the application.*

## Additional Notes
- **Database / Firebase:** The frontend currently utilizes Firebase for certain features. The Firebase config is already included in `Shree_Academy/frontend/src/firebase.js`.
- **Backend Mock Data:** The backend server uses an in-memory mock database for authentication with preset users:
  - Admin: `admin@shree.com` / `password`
  - Teacher: `teacher@shree.com` / `password`
  - Student: `student@shree.com` / `password`
