const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User.js");
const CheckIn = require('../models/CheckIn');
  
router.post('/register', async (req, res) => {
  console.log(req.body);
 const { username, password } = req.body;
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: 'Registration successful', success: true });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Username already exists', success: false });
    } else {
      res.status(500).json({ message: 'Internal Server Error', success: false });
    }
  }
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ userId: user._id }, 'secretkey', {
    expiresIn: '1h',
  });
  res.json({ username,token });
});

router.post('/check-in', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log(token);
  const decoded = jwt.verify(token, 'secretkey');
  console.log(decoded);
  const userId = decoded.userId;
  console.log(userId);  
  console.log(req.body);
  
  const {state1, mood, stress, feelings } = req.body;
  const checkIn = new CheckIn({ username:state1,mood, stress, feelings, userId });
  await checkIn.save();
  res.json({ message: 'Check-in saved successfully' });
});
router.get('/check-in/:username', async (req, res) => {
  
  const { username } = req.params;

  const checkIn = await CheckIn.findOne({ username});
console.log(checkIn);

  if (checkIn === null) {
    
    return res.json({ message: 'No check-in found for today.' });
  }
   else
   {
    res.json(checkIn);
   }
});


module.exports = router;