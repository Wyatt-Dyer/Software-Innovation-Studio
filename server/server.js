const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const OpenAI = require('openai'); // Import OpenAI SDK
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User created');
  } catch (err) {
    console.error('Error creating user:', err); // Log the error
    res.status(400).send('Error creating user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// OpenAI API initialization with API key directly in the code
const openai = new OpenAI({
  apiKey: "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",
});

// Chat route for handling prompts
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use the desired model
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    // Respond with the assistant's response
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    // Log and return an error response
    console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).send('Error communicating with OpenAI');
  }
});


app.listen(8080, () => {
  console.log('Server running on http://192.168.50.169:8080');
});
