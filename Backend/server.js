import cors from 'cors';
dotenv.config();
console.log('GA_CLIENT_EMAIL:', process.env.GA_CLIENT_EMAIL);
console.log('GA_PRIVATE_KEY:', process.env.GA_PRIVATE_KEY);
console.log('GA_PROJECT_ID:', process.env.GA_PROJECT_ID);

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MLP from './models/mlPage.model.js';
import MLPRoutes from './routes/MLP.route.js'
import PublicPage from './models/publicPage.model.js';
import PublicPageRoutes from './routes/publicPage.route.js'
import AdminRoutes from './routes/admin.route.js'
import secretKeyRoutes from './routes/secretKeys.route.js'
import apiRoutes from './routes/api.route.js'
import PrizeRoutes from './routes/prizes.route.js'

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Apply JSON middleware
app.use(express.json());
app.use("/api",MLPRoutes);
app.use("/api/public-page",PublicPageRoutes);
app.use("/api/admin",AdminRoutes);
app.use("/api/admin",secretKeyRoutes);
app.use("/api", apiRoutes);
app.use("/api",PrizeRoutes)
// Function to initialize default config







// Connect to MongoDB and initialize the default config
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('MongoDB connected');
     // Seed default configuration
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });



// PUT API: Update a specific section of the landing page

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
