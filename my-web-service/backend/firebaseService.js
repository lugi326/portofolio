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

const getData = async (path) => {
  const ref = db.ref(path);
  const snapshot = await ref.once('value');
  return snapshot.val();
};

const setData = async (path, data) => {
  const ref = db.ref(path);
  await ref.set(data);
};

const updateData = async (path, data) => {
  const ref = db.ref(path);
  await ref.update(data);
};

const deleteData = async (path) => {
  const ref = db.ref(path);
  await ref.remove();
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

const getAllTasks = async () => {
  const tasks = await getData('tugas');
  return tasks;
};

module.exports = {
  getData,
  setData,
  updateData,
  deleteData,
  addTask,
  getAllTasks
};