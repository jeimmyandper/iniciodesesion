const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // Puerto donde se ejecutará tu servidor

// Middleware
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/Login', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Esquema y modelo de usuario en MongoDB
const userSchema = new mongoose.Schema({
  usuario: String,
  contraseña: String,
});

const User = mongoose.model('User', userSchema);

// Ruta de registro
app.post('/register', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ usuario });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Crear un nuevo usuario
    const newUser = new User({ usuario, contraseña });
    await newUser.save();

    return res.status(200).json({ message: 'Registro exitoso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    // Verificar si el usuario y contraseña coinciden en la base de datos
    const user = await User.findOne({ usuario, contraseña });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    return res.status(200).json({ message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


