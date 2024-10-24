

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Importa cors
require('dotenv').config();

const app = express();
const URI = process.env.MONGODB_URI;

console.log('Mongodb uri:', URI);

// Middleware para habilitar CORS
app.use(cors()); // Usa cors

// Aumentar el tamaño máximo del cuerpo de la solicitud
app.use(bodyParser.json({ limit: '10mb' })); // Aumenta este valor según sea necesario
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Si necesitas enviar datos de formularios

// Middleware para parsear JSON (esto ya no es necesario, ya que body-parser lo hace)
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Hello world');
});

// Conectar a MongoDB
mongoose.connect(URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Modelo de usuario
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Modelo de reporte
const reportSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, default: 'open' },
    createdAt: { type: Date, default: Date.now },
    userID: mongoose.Schema.Types.ObjectId,
    location: String, // Añadir ubicación
});

const Report = mongoose.model('Report', reportSchema);

// Ruta para crear un nuevo usuario (registro)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });

    try {
        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});

// Ruta para autenticar al usuario y devolver token
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Ruta para crear un reporte
app.post('/api/reports', async (req, res) => {
    const newReport = new Report({
        title: req.body.title,
        description: req.body.description,
        userID: req.body.userID,
        location: req.body.location, // Captura la ubicación
        status: req.body.status, // Captura el estado
    });

    try {
        const report = await newReport.save();
        res.status(201).send(report);
    } catch (err) {
        res.status(500).send('Error saving report');
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Server running on port 3000');
});



