// /routes/status.js

const express = require('express');
const router = express.Router();
const config = require('../config/config');
const axios = require('axios');

// Route: GET /status/:jobid
router.get('/:jobid', async (req, res) => {
  const jobid = req.params.jobid;

  // Validate jobid
  if (!jobid) {
    return res.status(400).json({ error: 'Job ID is required.' });
  }

  try {
    // Construct the status API endpoint
    const statusEndpoint = `${config.api.baseurl}/results/${jobid}`;

    // Send GET request to the external API's status endpoint
    const response = await axios.get(statusEndpoint, {
      headers: {'Content-Type': 'application/json'},
      timeout: 10000, // 10 seconds timeout
    });

    // Handle the response from the external API
    if (response.status === 200) {
      const data = response.data;
      res.json(data);
    } else {
      console.error('Unexpected response status:', response.status);
      res.status(response.status).json({ error: `Unexpected response status: ${response.status}` });
    }
  } catch (error) {
    console.error('Error fetching job status:', error);

    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      res.status(error.response.status).json({
        error: error.response.data.message || 'An error occurred while fetching job status.',
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the API.');
      res.status(500).json({ error: 'No response received from the API.' });
    } else {
      // Something happened in setting up the request
      console.error('Error setting up the request:', error.message);
      res.status(500).json({ error: 'An error occurred while setting up the request.' });
    }
  }
});

module.exports = router;