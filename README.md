# Minecraft Server Manager

A web application to manage your Minecraft servers with an easy-to-use interface.

## Features

- Start/Stop Minecraft servers
- Monitor server status
- Manage server properties
- View connected players
- Console access

## Prerequisites

- Node.js (v14 or later)
- npm (comes with Node.js)
- MongoDB (local or MongoDB Atlas)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/minecraft-server-manager.git
   cd minecraft-server-manager
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/minecraft-manager
   JWT_SECRET=your_jwt_secret
   ```

5. Create a `.env` file in the `client` directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## Running the Application

1. Start the backend server:
   ```bash
   # In the root directory
   npm run server
   ```

2. Start the frontend development server:
   ```bash
   # Open a new terminal in the root directory
   npm run client
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Backend (Vercel/Heroku)

1. Push your code to GitHub
2. Connect your repository to Vercel or Heroku
3. Set the environment variables in the deployment settings

### Frontend (Vercel/Netlify)

1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `build` folder to your preferred hosting service

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
