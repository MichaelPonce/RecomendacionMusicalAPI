const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta para manejar las recomendaciones musicales
app.post('/api/recomendacionmusica', async (req, res) => {
    const { T_Categoria, T_Cantante, T_Nombre_Cancion } = req.body;

    if (!T_Categoria || !T_Cantante || !T_Nombre_Cancion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Configurar el transportador de nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Cambiar según el servicio de correo
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
        },
    });

    // Configurar el mensaje
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECEIVER,
        subject: '🎵 Nueva Recomendación Musical 🎶',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                <h2 style="color: #4CAF50;">🌟 Nueva Recomendación Musical 🌟</h2>
                <p><strong>🎼 Género Musical:</strong> ${T_Categoria}</p>
                <p><strong>🎤 Cantante/Grupo:</strong> ${T_Cantante}</p>
                <p><strong>🎵 Canción:</strong> ${T_Nombre_Cancion}</p>
                <p style="margin-top: 20px;">✨ ¡Agrega a la Lista de Canciones! ✨</p>
            </div>
        `,
    };
    

    try {
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'Recomendación enviada exitosamente.' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar la recomendación.' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

