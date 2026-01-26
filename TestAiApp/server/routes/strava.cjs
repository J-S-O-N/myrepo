const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const UserSettings = require('../models/UserSettings.cjs');

// Strava API configuration
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI || 'http://localhost:3001/api/strava/callback';

/**
 * GET /api/strava/auth
 * Initiate Strava OAuth flow
 */
router.get('/auth', auth, (req, res) => {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(STRAVA_REDIRECT_URI)}&approval_prompt=force&scope=activity:read_all,profile:read_all`;

  // Store user ID in session or state parameter for callback
  const state = Buffer.from(JSON.stringify({ userId: req.user.id })).toString('base64');

  res.json({
    success: true,
    authUrl: `${authUrl}&state=${state}`
  });
});

/**
 * GET /api/strava/callback
 * Handle Strava OAuth callback
 */
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`http://localhost:5173/health?strava_error=${error}`);
  }

  if (!code || !state) {
    return res.redirect('http://localhost:5173/health?strava_error=missing_params');
  }

  try {
    // Decode state to get user ID
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Update user settings with Strava tokens
    await UserSettings.update({
      strava_access_token: tokenData.access_token,
      strava_refresh_token: tokenData.refresh_token,
      strava_token_expires_at: tokenData.expires_at,
      strava_athlete_id: tokenData.athlete.id.toString(),
      strava_connected: true,
    }, {
      where: { user_id: userId }
    });

    // Redirect back to Health page with success
    res.redirect('http://localhost:5173/health?strava_connected=true');
  } catch (error) {
    console.error('Strava OAuth callback error:', error);
    res.redirect('http://localhost:5173/health?strava_error=auth_failed');
  }
});

/**
 * POST /api/strava/disconnect
 * Disconnect Strava account
 */
router.post('/disconnect', auth, async (req, res) => {
  try {
    const settings = await UserSettings.findOne({
      where: { user_id: req.user.id }
    });

    if (!settings || !settings.strava_connected) {
      return res.status(404).json({
        success: false,
        error: 'Strava not connected'
      });
    }

    // Revoke Strava access (optional but recommended)
    if (settings.strava_access_token) {
      try {
        await fetch('https://www.strava.com/oauth/deauthorize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.strava_access_token}`
          }
        });
      } catch (err) {
        console.error('Error revoking Strava token:', err);
      }
    }

    // Clear Strava data from database
    await settings.update({
      strava_access_token: null,
      strava_refresh_token: null,
      strava_token_expires_at: null,
      strava_athlete_id: null,
      strava_connected: false,
    });

    res.json({
      success: true,
      message: 'Strava disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting Strava:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect Strava'
    });
  }
});

/**
 * GET /api/strava/status
 * Check Strava connection status
 */
router.get('/status', auth, async (req, res) => {
  try {
    const settings = await UserSettings.findOne({
      where: { user_id: req.user.id }
    });

    if (!settings) {
      return res.json({
        success: true,
        connected: false
      });
    }

    res.json({
      success: true,
      connected: settings.strava_connected || false,
      athleteId: settings.strava_athlete_id || null
    });
  } catch (error) {
    console.error('Error checking Strava status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check Strava status'
    });
  }
});

/**
 * Refresh Strava access token if expired
 */
async function refreshStravaToken(settings) {
  const now = Math.floor(Date.now() / 1000);

  // Check if token is expired or will expire in the next 5 minutes
  if (settings.strava_token_expires_at && settings.strava_token_expires_at > now + 300) {
    return settings.strava_access_token;
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: settings.strava_refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const tokenData = await response.json();

    // Update settings with new token
    await settings.update({
      strava_access_token: tokenData.access_token,
      strava_refresh_token: tokenData.refresh_token,
      strava_token_expires_at: tokenData.expires_at,
    });

    return tokenData.access_token;
  } catch (error) {
    console.error('Error refreshing Strava token:', error);
    throw error;
  }
}

/**
 * GET /api/strava/activities
 * Fetch recent activities from Strava
 */
router.get('/activities', auth, async (req, res) => {
  try {
    const settings = await UserSettings.findOne({
      where: { user_id: req.user.id }
    });

    if (!settings || !settings.strava_connected) {
      return res.status(404).json({
        success: false,
        error: 'Strava not connected'
      });
    }

    // Refresh token if needed
    const accessToken = await refreshStravaToken(settings);

    // Fetch activities from Strava
    const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activities from Strava');
    }

    const activities = await response.json();

    // Transform activities to our format
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      type: activity.type, // Run, Ride, Swim, etc.
      date: activity.start_date,
      distance: Math.round(activity.distance), // meters
      duration: activity.moving_time, // seconds
      elevation: Math.round(activity.total_elevation_gain || 0), // meters
      calories: activity.calories || 0,
      pace: activity.average_speed ? (1000 / 60 / activity.average_speed) : null, // min/km
      heartRate: activity.average_heartrate || null,
    }));

    res.json({
      success: true,
      activities: transformedActivities
    });
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities'
    });
  }
});

/**
 * GET /api/strava/stats
 * Fetch athlete stats from Strava
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const settings = await UserSettings.findOne({
      where: { user_id: req.user.id }
    });

    if (!settings || !settings.strava_connected) {
      return res.status(404).json({
        success: false,
        error: 'Strava not connected'
      });
    }

    // Refresh token if needed
    const accessToken = await refreshStravaToken(settings);

    // Fetch athlete stats
    const response = await fetch(`https://www.strava.com/api/v3/athletes/${settings.strava_athlete_id}/stats`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats from Strava');
    }

    const stats = await response.json();

    // Transform stats to our format
    const transformedStats = {
      allTime: {
        distance: Math.round(stats.all_run_totals?.distance || 0),
        activities: stats.all_run_totals?.count || 0,
        elevation: Math.round(stats.all_run_totals?.elevation_gain || 0),
      },
      ytd: {
        distance: Math.round(stats.ytd_run_totals?.distance || 0),
        activities: stats.ytd_run_totals?.count || 0,
        elevation: Math.round(stats.ytd_run_totals?.elevation_gain || 0),
      },
      recent: {
        distance: Math.round(stats.recent_run_totals?.distance || 0),
        activities: stats.recent_run_totals?.count || 0,
        elevation: Math.round(stats.recent_run_totals?.elevation_gain || 0),
      }
    };

    res.json({
      success: true,
      stats: transformedStats
    });
  } catch (error) {
    console.error('Error fetching Strava stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

module.exports = router;
