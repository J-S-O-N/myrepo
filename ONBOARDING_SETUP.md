# Customer Onboarding Setup Guide

## Overview
A comprehensive onboarding flow has been added to BankApp to collect customer CRM data during registration. New users must complete a 3-step onboarding process before accessing the application.

## Database Configuration

**Database**: PostgreSQL 14
**Connection**: localhost:5432
**Database Name**: testaiapp
**User**: jonathan.singh

PostgreSQL is used for both development and production environments to ensure consistency and leverage advanced features like ENUM types, better concurrent write handling, and full ACID compliance.

## Database Schema Changes

### Updated User Model
The `users` table now includes the following CRM fields:

```sql
ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN profile_picture_url VARCHAR(500);
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN onboarding_step INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN account_status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending';
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP;
```

### UserSettings Table
Address information is stored in the existing `user_settings` table:
- `street_address`
- `city`
- `postal_code`
- `country` (defaults to 'South Africa')

## API Endpoints

### Authentication
- `POST /api/auth/login` - Returns JWT token
- `POST /api/auth/register` - Creates new user account

### Onboarding
- `GET /api/onboarding/status` - Check user's onboarding progress
- `POST /api/onboarding/step1` - Save personal information
- `POST /api/onboarding/step2` - Save address information
- `POST /api/onboarding/complete` - Mark onboarding as complete
- `GET /api/onboarding/username-available/:username` - Check username availability

## Frontend Components

### New Components
1. **Onboarding.jsx** - Multi-step onboarding wizard
   - Step 1: Personal Info (username, name, phone, DOB)
   - Step 2: Address (street, city, postal code, country)
   - Step 3: Completion screen

2. **Onboarding.css** - Styling matching Login page design

### Updated Components
- **App.jsx** - Added onboarding flow logic
- **Login.jsx** - Enhanced with feature showcase

## Onboarding Flow

### Step 1: Personal Information
**Required Fields:**
- Username (3-50 characters, alphanumeric, underscore, hyphen)
- First Name
- Last Name

**Optional Fields:**
- Phone Number (validated format)
- Date of Birth

**Features:**
- Real-time username availability checking
- Visual feedback (✓ available, ✗ taken)
- Debounced API calls (500ms)
- Inline validation

### Step 2: Address Information
**Required Fields:**
- Street Address
- City
- Postal Code

**Optional Fields:**
- Country (dropdown with common countries)

### Step 3: Completion
- Celebration animation
- Summary of collected data
- Auto-completes onboarding
- Redirects to dashboard

## Setup Instructions

### 1. Database Migration
The User model has been updated with new fields. PostgreSQL will automatically create tables on server startup.

```bash
# Start PostgreSQL if not running
brew services start postgresql@14

# Create database (one-time setup)
createdb testaiapp

# Start the server
cd TestAiApp
npm run dev
```

### 2. Server Restart
Restart the backend server to load new routes:

```bash
cd TestAiApp
npm run dev
```

### 3. Clear Browser Data
Clear sessionStorage to test fresh login flow:

```javascript
// In browser console
sessionStorage.clear();
```

## Testing the Flow

### Test Scenario 1: New User
1. Go to login page
2. Enter new email and password (8+ chars)
3. Submit - user is created
4. Onboarding screen appears
5. Complete Step 1 (personal info)
6. Complete Step 2 (address)
7. View completion screen
8. Click "Get Started"
9. Dashboard appears

### Test Scenario 2: Existing User
1. Login with existing credentials
2. If `onboarding_completed = false`, see onboarding
3. If `onboarding_completed = true`, go to dashboard

### Test Scenario 3: Username Validation
1. Enter username in Step 1
2. Wait 500ms - API call checks availability
3. See checkmark (✓) if available
4. See X (✗) if taken
5. Cannot proceed with taken username

## Username Rules
- Minimum 3 characters
- Maximum 50 characters
- Allowed: letters (a-z, A-Z)
- Allowed: numbers (0-9)
- Allowed: underscore (_)
- Allowed: hyphen (-)
- Case-sensitive
- Must be unique

## CRM Data Collected

### Personal Information
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| username | String | Yes | 3-50 chars, alphanumeric |
| email | String | Yes | Valid email format |
| first_name | String | Yes | Max 100 chars |
| last_name | String | Yes | Max 100 chars |
| phone_number | String | No | Phone format |
| date_of_birth | Date | No | Valid date, not future |

### Address Information
| Field | Type | Required | Default |
|-------|------|----------|---------|
| street_address | String | Yes | - |
| city | String | Yes | - |
| postal_code | String | Yes | - |
| country | String | Yes | South Africa |

### Account Status
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| onboarding_completed | Boolean | false | Has user finished onboarding |
| onboarding_step | Integer | 0 | Current step (0-3) |
| account_status | Enum | pending | active/inactive/suspended/pending |

## Security Considerations

### Authentication
- JWT token required for all onboarding endpoints
- Token verified on every request
- User ID extracted from token (cannot be forged)

### Username Uniqueness
- Database constraint ensures uniqueness
- API checks availability before allowing submission
- Real-time feedback prevents submission errors

### Data Validation
**Server-side:**
- All fields validated before saving
- SQL injection prevention via Sequelize ORM
- Type checking and format validation

**Client-side:**
- Immediate feedback on invalid input
- Pattern matching for username
- Required field enforcement

## Error Handling

### Common Errors
1. **Username taken** (409 Conflict)
   - Message: "Username already taken"
   - Solution: Choose different username

2. **Validation failed** (400 Bad Request)
   - Message: Specific validation error
   - Solution: Fix indicated field

3. **Unauthorized** (401)
   - Message: "Access token required"
   - Solution: Re-login to get new token

4. **Server error** (500)
   - Message: "Internal server error"
   - Solution: Check server logs

## Design Features

### Visual Design
- Animated background circles (floating effect)
- Progress bar with step indicators
- Checkmarks for completed steps
- Icons for input fields
- Consistent blue theme (#0ea5e9)

### Animations
- Slide-in entrance animations
- Username availability indicator
- Progress bar transitions
- Completion celebration (bouncing icon)
- Button hover effects

### Responsive Design
- Desktop: 2-column form layout
- Tablet: Single column layout
- Mobile: Optimized spacing, hidden labels

## Files Modified

### Backend
- `server/models/User.cjs` - Added CRM fields
- `server/routes/onboarding.cjs` - New onboarding endpoints
- `server/index.cjs` - Registered onboarding routes

### Frontend
- `src/App.jsx` - Added onboarding flow logic
- `src/components/Onboarding.jsx` - New component
- `src/components/Onboarding.css` - New stylesheet
- `src/components/Login.jsx` - Enhanced with features showcase
- `src/components/Login.css` - Updated styling

## Troubleshooting

### Issue: Onboarding keeps showing after completion
**Solution:**
```javascript
// Check user's onboarding status in database
// Ensure onboarding_completed = true
```

### Issue: Username availability check not working
**Solution:**
```javascript
// Check API endpoint: GET /api/onboarding/username-available/:username
// Ensure server is running on port 3001
// Check browser console for errors
```

### Issue: Database errors after update
**Solution:**
```bash
# Drop and recreate tables (DEVELOPMENT ONLY)
psql -U jonathan.singh -d testaiapp -c "DROP TABLE IF EXISTS user_settings CASCADE; DROP TABLE IF EXISTS users CASCADE; DROP TABLE IF EXISTS goals CASCADE;"
# Restart server to recreate tables
npm run dev
```

### Issue: Token expired during onboarding
**Solution:**
- Tokens expire after 24 hours
- User must re-login to get new token
- Onboarding progress is saved

## Future Enhancements

### Planned Features
1. **Profile Picture Upload** - Allow users to upload avatar
2. **Email Verification** - Verify email during onboarding
3. **Phone Verification** - SMS verification code
4. **Document Upload** - ID verification for KYC
5. **Social Login** - OAuth integration (Google, Facebook)
6. **Onboarding Skip** - Allow partial completion
7. **Progress Persistence** - Resume from any step
8. **Welcome Email** - Automated email after completion

### Analytics Tracking
- Track completion rate per step
- Time spent on each step
- Drop-off points
- Most common errors
- Username selection patterns

## Support

For issues or questions:
- Check server logs: `npm run dev`
- Check browser console for errors
- Verify API responses in Network tab
- Test with fresh database

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
