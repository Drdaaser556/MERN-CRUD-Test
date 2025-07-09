const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Connect to local MongoDB (shown in MongoDB Compass)
mongoose.connect('mongodb://127.0.0.1:27017/mern_crud')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error(err));

// CRUD Routes
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

app.put('/users/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
