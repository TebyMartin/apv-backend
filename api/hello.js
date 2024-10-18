// api/hello.js
import express from 'express';
import cors from 'cors';

const app = express();

// Configurar CORS usando la variable de entorno FRONTEND_URL
const allowedOrigin = process.env.FRONTEND_URL || '*';

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// Middleware y rutas
app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from Vercel + Express!' });
});

// Exporta el handler para serverless
export default app;
