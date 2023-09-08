const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 9443;

app.use(bodyParser.json());

const PANTRY_API_KEY = '90735409-0b64-47f4-b871-bb8cf3a6c826';
const PANTRY_API_BASE_URL = 'https://getpantry.cloud/api/pantry';

// Store for baskets
const baskets = {};

// Create (POST)
app.post('/add-item', async (req, res) => {
  try {
    const { pantry_id, basket_key, value } = req.body;

    if (!pantry_id || !basket_key || !value) {
      return res.status(400).json({ 
        error: 'Invalid request' });
    }

    if (pantry_id !== PANTRY_API_KEY) {
      return res.status(403).json({ error: 'Invalid Pantry ID' });
    }

    baskets[basket_key] = value;
    
    return res.status(201).json({
         message: 'Item added successfully' });
  } catch (error) {
    return res.status(500).json({
         error: 'Internal Server Error' });
  }
});

// Read (GET)
app.get('/get-item', async (req, res) => {
  try {
    const pantry_id = req.query.pantry_id;
    const basket_key = req.query.basket_key;

    if (!pantry_id || !basket_key) {
      return res.status(400).json({ 
        error: 'Invalid request' });
    }

    if (pantry_id !== PANTRY_API_KEY) {
      return res.status(403).json({
         error: 'Invalid Pantry ID' });
    }

    const value = baskets[basket_key];
    
    if (!value) {
      return res.status(404).json({
         error: 'Basket not found' });
    }

    return res.status(200).json({ value });
  } catch (error) {
    return res.status(500).json({
         error: 'Internal Server Error' });
  }
});

// List Baskets (GET)
app.get('/list-baskets', async (req, res) => {
  try {
    const pantry_id = req.query.pantry_id;
    const filter_name = req.query.filter_name;

    if (!pantry_id) {
      return res.status(403).json({ error: 'Invalid Pantry ID' });
    }

    if (pantry_id !== PANTRY_API_KEY) {
      return res.status(403).json({ error: 'Invalid Pantry ID' });
    }

    let basketList = Object.keys(baskets);

    if (filter_name) {
      basketList = basketList.filter((basket) => basket.includes(filter_name));
    }

    const basketDetails = {};
    for (const basket of basketList) {
      basketDetails[basket] = baskets[basket];
    }

    return res.status(200).json(basketDetails);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update (PUT)
app.put('/update-item', async (req, res) => {
  try {
    const { pantry_id, basket_key, new_value } = req.body;

    if (!pantry_id || !basket_key || !new_value) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    if (pantry_id !== PANTRY_API_KEY) {
      return res.status(403).json({ error: 'Invalid Pantry ID' });
    }

    if (!baskets[basket_key]) {
      return res.status(404).json({ error: 'Basket not found' });
    }

    baskets[basket_key] = new_value;

    return res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete (DELETE)
app.delete('/delete-item', async (req, res) => {
  try {
    const pantry_id = req.query.pantry_id;
    const basket_key = req.query.basket_key;

    if (!pantry_id || !basket_key) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    if (pantry_id !== PANTRY_API_KEY) {
      return res.status(403).json({ error: 'Invalid Pantry ID' });
    }

    if (!baskets[basket_key]) {
      return res.status(404).json({ error: 'Basket not found' });
    }

    delete baskets[basket_key];

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Dockerized API listening on port 9443
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
