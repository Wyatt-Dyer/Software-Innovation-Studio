const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.SPOONACULAR_API_KEY;

app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=mushroom`,
  headers: { }
};

app.get('/fetch-data', async (req, res) => {
  try {
    const response = await axios.request(config)
    res.json(response.data)
  } catch (error) {
    res.json(error.message)
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
