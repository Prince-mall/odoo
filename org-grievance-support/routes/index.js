const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/dashboard', auth, (req, res) => {
  res.render('dashboard', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect('/');
  });
});

module.exports = router;
