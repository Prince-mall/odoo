const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', {
      messages: errors.array().map(error => ({ text: error.msg, type: 'danger' }))
    });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.render('register', {
        messages: [{ text: 'User already exists', type: 'danger' }]
      });
    }

    user = new User({
      name,
      email,
      password,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', {
      messages: errors.array().map(error => ({ text: error.msg, type: 'danger' }))
    });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        messages: [{ text: 'Invalid Credentials', type: 'danger' }]
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        messages: [{ text: 'Invalid Credentials', type: 'danger' }]
      });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
