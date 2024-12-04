import PublicPage from '../models/publicPage.model.js';

// Fetch PublicPage configuration
export const getPP = async (req, res) => {
  // Helper function to initialize default configuration
  const initializeDefaultConfig = async () => {
    try {
      const existingConfig = await PublicPage.findOne();
      if (!existingConfig) {
        await PublicPage.create({}); // Create an empty PublicPage with default values
        console.log('Default configuration for PublicPage initialized.');
      } else {
        console.log('Default configuration for PublicPage already exists.');
      }
    } catch (err) {
      console.error('Error initializing default configuration for PublicPage:', err.message);
    }
  };

  try {
    console.log('Fetching PublicPage');
    // Fetch the main landing page configuration
    const publicPageData = await PublicPage.findOne();
    if (!publicPageData) {
      await initializeDefaultConfig(); // Initialize default config if none exists
    }
    res.status(200).json({ success: true, data: publicPageData });
    console.log('Fetched PublicPage');
  } catch (error) {
    console.error('Error fetching the Public Page', error);
    res.status(500).json({ success: false, message: 'Error fetching the PublicPage data.' });
  }
};

// Update PublicPage configuration
export const updatePP = async (req, res) => {
  const updatedData = req.body;

  try {
    console.log('Updating PublicPage');
    const publicPageData = await PublicPage.findOneAndUpdate(
      {}, // Find the first (and only) document
      { $set: updatedData }, // Update with the data provided in the request body
      { new: true, upsert: true } // Return the updated document and create it if it doesn't exist
    );
    res.status(200).json({ success: true, data: publicPageData });
    console.log('Updated PublicPage');
  } catch (error) {
    console.error('Error updating the Public Page', error);
    res.status(500).json({ success: false, message: 'Error updating the PublicPage data.' });
  }
};
