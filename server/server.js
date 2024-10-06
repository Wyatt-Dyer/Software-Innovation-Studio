const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const OpenAI = require('openai'); // Import OpenAI SDK
const multer = require('multer'); // Import multer middleware for file upload
const { v4: uuidv4 } = require('uuid');
const { Storage } = require('@google-cloud/storage'); // Import GCS SDK
const path = require('path');
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
  apiKey: process.env.OPENAI_API_KEY,
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

// User schema and model
const speciesSchema = new mongoose.Schema({
  // userId: { type: _id, required: true, unique: true },
  name: {type: String, required: true, unique: true},
  imageUrl: {type: String, required: true},
  contentType: {type: String, required: true},
  createdAt: { type: Date, required: true },
});

const Species = mongoose.model('Species', speciesSchema);

// Ensure that keys file for the google cloud storage service account exists
const gcsKeyPath = process.env.GCS_SERVICE_KEY_PATH;
const storage = new Storage({ keyFilename: path.join(__dirname, gcsKeyPath) });
const bucket = storage.bucket('bucket-quickstart-camprismatest');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({success: false, message: 'No file provided.'});
  }

  console.log('File received by server!');

  // Create a new blob in the bucket and upload the file data
  const folderName = 'uploads';
  const destination = `${folderName}/${req.file.originalname}`;
  const blob = bucket.file(destination);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: req.file.mimetype,
  });

  blobStream.on('error', (err) => {
    console.error(err);
    res.status(500).send(err);
  });

  blobStream.on('finish', () => {
    // res.status(200).send('File uploaded successfully.');
    console.log('File uploaded to GCS successfully!');
  });

  blobStream.end(req.file.buffer); // Upload the file buffer

  const image = new Species({
    // using uuid here to create a unique name for now
    // until the computer vision is ready to be integrated
    // name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
    name: `${uuidv4()}`,
    imageUrl: `https://storage.googleapis.com/bucket-quickstart-camprismatest/uploads/${req.file.originalname}`,
    contentType: req.file.mimetype,
    createdAt: new Date(),
  });
  console.log('Entry created for image saving:\n', image.toJSON());

  try {
    await image.save();
  } catch (error) {
    console.error(error);
    return res.status(400).json({success: false, message: error.message});
  }
  return res.status(201).json({success: true, message: 'Storage object created successfully.'});
});

app.get('/species', async (req, res) => {
  try {
    const species = await Species.find({});
    res.json(species);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Species.find({});
    res.json(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(8080, () => {
  console.log('Server running on http://192.168.0.110:8080');
});
