# Echo

Echo is a realtime chat app built with React, Express, Socket.IO, MongoDB, and JWT auth.

It supports private chats, group channels, friend requests, blocking, typing indicators, and online presence. The app is still a portfolio/MVP project, but the core chat flow is functional and the backend checks auth and channel membership before allowing message or socket access.

## Tech Stack

- React + Vite
- Tailwind CSS
- Zustand
- Express
- Socket.IO
- MongoDB + Mongoose
- JWT access and refresh tokens


## Running Locally

Install dependencies separately for the server and client.

```bash
cd server
npm install
```

```bash
cd client
npm install
```

Create local env files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Server env:

```env
PORT=5000
MONGO_CONNECTION_STRING=your-mongodb-connection-string
JWT_SECRET=your-long-random-secret
REFRESH_JWT_SECRET=another-long-random-secret
REFRESH_JWT_EXPIRE=30d
CLIENT_ORIGIN=http://localhost:5173
```

Client env:

```env
VITE_APP_API_BASE_URL=http://localhost:5000/api
VITE_APP_SOCKET_URL=http://localhost:5000

```

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

The frontend runs on Vite, usually at `http://localhost:5173`.


## Deployment

Deploy the frontend and backend separately.

For the backend, use a Node host that supports long-running servers and WebSockets, such as Render (i have used render )

Backend commands:

```bash
npm install
npm run build
npm start
```

Backend environment variables:

```env
PORT=provided-by-host-or-5000
MONGO_CONNECTION_STRING=your-production-mongodb-url
JWT_SECRET=your-production-secret
REFRESH_JWT_SECRET=your-production-refresh-secret
REFRESH_JWT_EXPIRE=30d
CLIENT_ORIGIN=https://your-frontend-domain.com
```

For the frontend, use a static host such as Vercel.
Frontend commands:

```bash
npm install
npm run build
```

Build output:

```txt
dist
```

Frontend environment variables:

```env
VITE_APP_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_SOCKET_URL=https://your-backend-domain.com
```
