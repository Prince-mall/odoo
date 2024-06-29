const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts'); 

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); 

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/grievances', require('./routes/grievance'));
app.use('/', require('./routes/index'));

// // Routes
// app.get('/', (req, res) => {
//   res.render('login'); // Example route to render 'index.pug'
// });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
