# Strava Integration Setup Guide

## Overview
The Strava integration is now fully implemented in BankApp. This guide will help you complete the setup by registering your app with Strava and configuring the credentials.

## Current Status
✅ Backend OAuth routes implemented
✅ Database schema updated with Strava columns
✅ Frontend UI with connection flow
✅ Automatic token refresh
⏳ Awaiting Strava API credentials

## Setup Steps

### 1. Create a Strava API Application

1. Go to https://www.strava.com/settings/api
2. Log in to your Strava account (or create one if you don't have it)
3. Click "Create New Application" or "My API Application"

### 2. Fill in Application Details

**Application Name:** BankApp (or your preferred name)

**Category:** Choose "Health & Fitness" or "Analytics"

**Club:** Leave blank (optional)

**Website:** `http://localhost:5173`

**Authorization Callback Domain:** `localhost`

**Authorization Callback URL:** `http://localhost:3001/api/strava/callback`

**Application Description:**
```
Personal banking app with integrated fitness tracking.
Syncs Strava activities to provide a unified view of health and financial goals.
```

### 3. Get Your Credentials

After creating the application, you'll see:
- **Client ID** (a number, e.g., 123456)
- **Client Secret** (a long string)

### 4. Update Your .env File

Open `TestAiApp/.env` and replace the placeholder values:

```bash
# Strava API (OAuth 2.0)
STRAVA_CLIENT_ID=YOUR_CLIENT_ID_HERE
STRAVA_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
STRAVA_REDIRECT_URI=http://localhost:3001/api/strava/callback
```

**Important:** Never commit your actual credentials to Git. The .env file is already gitignored.

### 5. Restart the Backend Server

After updating the .env file, restart the backend server:

```bash
# Stop the current server (Ctrl+C or kill the process)
# Then restart:
cd TestAiApp
node server/index.cjs
```

### 6. Test the Integration

1. Open BankApp in your browser: `http://localhost:5173`
2. Log in to your account
3. Navigate to "Health & Fitness" page
4. Click "ℹ️ How it works" to read the guide
5. Click "🔗 Connect to Strava"
6. You'll be redirected to Strava - click "Authorize"
7. You'll be redirected back to BankApp
8. Your recent Strava activities should now appear!

## Features

### What Gets Synced
- Recent activities (runs, rides, walks, etc.)
- Activity distance (in km)
- Activity duration (in minutes)
- Elevation gain
- Activity date and time
- Activity name

### Automatic Token Refresh
The integration automatically refreshes your access token when it expires, so you won't need to reconnect manually.

### Privacy
- Your Strava password is never stored in BankApp
- Only read access is requested (activity:read)
- You can disconnect at any time from the Health page

## Troubleshooting

### "Invalid client_id" error
- Make sure you've replaced `your_strava_client_id_here` with your actual Client ID
- Check that there are no extra spaces in the .env file
- Restart the backend server after changing .env

### "Authorization callback domain mismatch" error
- Verify the callback URL in Strava settings matches exactly: `http://localhost:3001/api/strava/callback`
- Make sure the Authorization Callback Domain is set to `localhost`

### No activities showing up
- Check that you have recent activities in your Strava account
- Try disconnecting and reconnecting
- Check the browser console for error messages

### Connection immediately fails
- Verify the backend server is running on port 3001
- Check that STRAVA_CLIENT_SECRET is correct
- Look at the backend server logs for detailed error messages

## API Endpoints

The following endpoints are available (all require JWT authentication):

- `GET /api/strava/auth` - Initiate OAuth flow
- `GET /api/strava/callback` - Handle OAuth callback
- `GET /api/strava/status` - Check connection status
- `GET /api/strava/activities` - Fetch recent activities
- `GET /api/strava/stats` - Fetch athlete statistics
- `POST /api/strava/disconnect` - Disconnect Strava

## Production Deployment

When deploying to production:

1. Update the redirect URI to your production domain:
   ```bash
   STRAVA_REDIRECT_URI=https://yourdomain.com/api/strava/callback
   ```

2. Update the Strava API application settings:
   - Website: `https://yourdomain.com`
   - Authorization Callback Domain: `yourdomain.com`
   - Authorization Callback URL: `https://yourdomain.com/api/strava/callback`

3. Store credentials in AWS Secrets Manager (not .env):
   ```bash
   STRAVA_CLIENT_ID={{resolve:secretsmanager:bankapp/prod/strava-client-id}}
   STRAVA_CLIENT_SECRET={{resolve:secretsmanager:bankapp/prod/strava-client-secret}}
   ```

## Strava API Documentation

- API Documentation: https://developers.strava.com/docs/reference/
- OAuth Flow: https://developers.strava.com/docs/authentication/
- Rate Limits: 100 requests per 15 minutes, 1000 requests per day

## Support

If you encounter issues not covered in this guide:
1. Check the backend server logs
2. Check the browser console for errors
3. Review the Strava API documentation
4. Verify all credentials are correctly set
