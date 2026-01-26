const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth.cjs');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Path to .env file
const envPath = path.join(__dirname, '../../.env');

// Get current Strava configuration status
router.get('/strava', async (req, res) => {
  try {
    const hasClientId = !!process.env.STRAVA_CLIENT_ID && process.env.STRAVA_CLIENT_ID !== 'your_strava_client_id_here';
    const hasClientSecret = !!process.env.STRAVA_CLIENT_SECRET && process.env.STRAVA_CLIENT_SECRET !== 'your_strava_client_secret_here';

    res.json({
      configured: hasClientId && hasClientSecret,
      clientId: hasClientId ? '••••••' + process.env.STRAVA_CLIENT_ID.slice(-4) : '',
      redirectUri: process.env.STRAVA_REDIRECT_URI || 'http://localhost:3001/api/strava/callback',
    });
  } catch (error) {
    console.error('Get Strava config error:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Update Strava configuration
router.put('/strava', async (req, res) => {
  try {
    const { clientId, clientSecret } = req.body;

    if (!clientId || !clientSecret) {
      return res.status(400).json({ error: 'Client ID and Client Secret are required' });
    }

    // Validate Client ID (should be numeric for Strava)
    if (!/^\d+$/.test(clientId.trim())) {
      return res.status(400).json({ error: 'Invalid Client ID format. Should be numeric.' });
    }

    // Read current .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update Strava credentials
    const updatedEnv = updateEnvVar(envContent, 'STRAVA_CLIENT_ID', clientId.trim());
    const finalEnv = updateEnvVar(updatedEnv, 'STRAVA_CLIENT_SECRET', clientSecret.trim());

    // Write back to .env file
    fs.writeFileSync(envPath, finalEnv, 'utf8');

    // Update process.env (for current session)
    process.env.STRAVA_CLIENT_ID = clientId.trim();
    process.env.STRAVA_CLIENT_SECRET = clientSecret.trim();

    res.json({
      success: true,
      message: 'Strava configuration updated successfully. Changes will take effect immediately.',
      configured: true,
    });
  } catch (error) {
    console.error('Update Strava config error:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Helper function to update or add an environment variable
function updateEnvVar(envContent, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');

  if (regex.test(envContent)) {
    // Update existing variable
    return envContent.replace(regex, `${key}=${value}`);
  } else {
    // Add new variable (append to Strava section)
    const stravaSection = '# Strava API (OAuth 2.0)';
    if (envContent.includes(stravaSection)) {
      return envContent.replace(
        stravaSection,
        `${stravaSection}\n${key}=${value}`
      );
    } else {
      // If no Strava section exists, append at the end
      return envContent.trim() + `\n\n# Strava API (OAuth 2.0)\n${key}=${value}\n`;
    }
  }
}

module.exports = router;
