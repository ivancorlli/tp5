const express = require('express');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'tp5';

// Middleware
app.use(express.json());

// Ruta para obtener información de randomuser.me
app.get('/user', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api');
    const userData = response.data.results[0];
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de randomuser.me' });
  }
});

// Ruta para guardar datos 
app.post('/save', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection('datos');

    const data = req.body;
    await collection.insertOne(data);

    res.json({ message: 'Datos guardados exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar los datos' });
  } finally {
    client.close();
  }
});

// Ruta para recuperar datos
app.get('/getdata', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection('datos');

    const data = await collection.find().toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los datos' });
  } finally {
    client.close();
  }
});

app.listen(port, () => {
  console.log(`Runnning on port ${port}`);
});
