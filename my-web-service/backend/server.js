const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

const app = express();
app.use(bodyParser.json());

const queryFlowise = async (data, sessionId) => {
  try {
    const response = await fetch("https://flowisefrest.onrender.com/api/v1/prediction/your-model-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, overrideConfig: { sessionId } })
    });
    return await response.json();
  } catch (error) {
    console.error('Error querying Flowise:', error);
    throw error;
  }
};

app.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    const response = await queryFlowise({ question: message }, sessionId);
    res.send(response);
  } catch (error) {
    res.status(500).send('Error processing message');
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await getData('tugas');
    res.send(tasks);
  } catch (error) {
    res.status(500).send('Error fetching tasks');
  }
});

app.post('/tasks', async (req, res) => {
  const { dosen, namaTugas, deadline, sessionId } = req.body;
  try {
    await addTask(dosen, namaTugas, deadline, sessionId);
    res.send('Task added successfully');
  } catch (error) {
    res.status(500).send('Error adding task');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

const getData = async (path) => {
  const ref = db.ref(path);
  const snapshot = await ref.once('value');
  return snapshot.val();
};

const addTask = async (dosen, namaTugas, deadline, sessionId) => {
  const taskRef = db.ref('tugas');
  const newTaskRef = taskRef.child(`${Date.now()}`);
  await newTaskRef.set({
    dosen: dosen,
    namaTugas: namaTugas,
    deadline: deadline,
    sessionId: sessionId
  });
};