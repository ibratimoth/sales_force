const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectionDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentsRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const agentRoutes = require('./routes/agentNoteRoutes');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,        // prevents JS from reading the cookie
    secure: true,         // true if HTTPS
    sameSite: 'none',      
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(cors({
  origin: `https://salesforce.rigel.co.tz`, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// ------------------ ROUTES ------------------
app.get('/', (req, res) => res.send('It is running'));
app.get('/cookies', (req, res) => res.send(req.cookies));

app.use('/user', userRoutes);
app.use('/department', departmentRoutes);
app.use('/tracking', trackingRoutes); // 
app.use('/agent', agentRoutes); // 

// ------------------ SERVER & SOCKET.IO ------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `https://salesforce.rigel.co.tz`,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible inside controllers
app.set('io', io);

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Optional: join rooms by agent ID
  socket.on('joinAgentRoom', (agentId) => {
    socket.join(`agent_${agentId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ------------------ DATABASE & START ------------------
connectionDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at https://salesforce.rigel.co.tz`);
});

module.exports = server;
